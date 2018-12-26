/*
 * @Author: qiansc
 * @Date: 2018-12-06 16:04:08
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-12-26 13:33:19
 */
/**
 * skeleton的生命周期 init > create [> pause] [> resume] > destroy
 * skeleton主要是面向rt-transition or service的抽象
 * skeleton实际渲染
 */
import { SkeletonAppearance } from "./appearance";
const TargetClass = "rt-skeleton";
let SupportTransitionEvent = false;

export class Skeleton {
  private created = false;
  // 生命周期状态: 暂停
  private paused = false;
  // 生命周期状态: 进入销毁
  private destroying = false;
  // 生命周期状态: 已经销毁
  private destried = false;

  private target: HTMLElement;

  constructor(
    private container: HTMLElement,
    private app: SkeletonAppearance,
    private options: TabSkeletonOption = {},
  ) {
    if (this.options.fullScreen === undefined) {
      this.options.fullScreen = true;
    }
    if (this.options.fullScreenBuffer === undefined) {
      this.options.fullScreenBuffer = 100;
    }
  }
  /** 创建Skeleton */
  public create(): void {
    if (this.created) {
      return;
    }
    this.created = true;
    this.removeTarget();
    if (this.target === undefined) {
      this.target = document.createElement("div");
      this.container.appendChild(this.target);
      this.initContent();
    }
    const offset = this.offset();
    this.app.render({
      offsetX: offset.x,
      offsetY: offset.y + (this.options.fullScreenBuffer || 0),
      target: this.target,
    });
    this.startTimeout();
  }
  /** 销毁Skeleton */
  public destroy(): void {
    if (this.destried) {
      return;
    }
    this.destroying = true;
    this.tryDestroy();
  }

  /** 暂停Skeleton的生命周期变化 */
  public pause(): void {
    this.paused = true;
  }

  /** 恢复Skeleton的生命周期变化 */
  public resume(): void {
    this.paused = false;
    this.tryDestroy();
  }
  private initContent() {
    const offset = this.offset();
    this.target.className = TargetClass;
    this.target.style.position = this.options.isFixed ? "fixed" : "absolute";
    this.target.style.width = "100%";
    this.target.style.top = (this.options.isFixed ? offset.y + "px" : 0).toString();
    this.target.style.left = "0";
    if (this.options.background) {
      this.target.style.background = this.options.background;
    }
    this.target.style.zIndex = (this.options.zIndex || "101").toString();
    if (this.options.fadeOut) {
      const duration = (this.options.fadeOutDuration || 350) / 1000;
      this.target.style.transition = `opacity ${duration}s ease-in-out`;
      const style = document.createElement("style");
      // child 元素快速隐藏 避免重叠
      style.innerHTML = ".sk-fadeout{opacity: 0;} .sk-fadeout > * {transition: opacity 0.1s linear; opacity: 0;}";
      this.target.appendChild(style);
    }
    if (this.options.fullScreen) {
      const height = ((document.documentElement && document.documentElement.clientHeight)
       || document.body.clientHeight) - offset.y + (this.options.fullScreenBuffer || 0);
      this.target.style.height = height + "px";
    }
  }
  // 兜底销毁
  private startTimeout(): void {
    if (this.options.timeout) {
      setTimeout(() => {
        this.destroy();
      }, this.options.timeout);
    }
  }
  private tryDestroy() {
    if (this.paused === false) {
      if (this.destroying) {
        this.destried = true;
        this.destroying = false;
        if (this.target && this.options.fadeOut) {
          this.target.className += " sk-fadeout";
          this.target.addEventListener("transitionend", () => {
            SupportTransitionEvent = true;
            this.app.destroy();
            this.removeTarget();
          });
          if (!SupportTransitionEvent) {
            // 未确认支持TransitionEvent时使用setTimeout兜底移除
            setTimeout(
              () => {
                this.removeTarget();
              },
              (this.options.fadeOutDuration || 350) + 200,
            );
          }
        } else {
          this.app.destroy();
          this.removeTarget();
        }
      }
    }
  }
  private removeTarget() {
    if (this.target) {
      this.container.removeChild(this.target);
      delete this.target;
    }
    const old = this.container.querySelectorAll(`.${TargetClass}`);
    // NodeListOf May not have forEach function in some browser
    for (const item of old as any) {
      this.container.removeChild(item);
    }
  }
  private offset() {
    if (this.options.isOffset && this.container && this.container.getBoundingClientRect) {
      const rect = this.container.getBoundingClientRect();
      return {
        x: this.options.offsetX ? this.options.offsetX : rect.left,
        y: this.options.offsetY ? this.options.offsetY : rect.top,
      };
    }
    return {x: 0, y: 0};
  }
}

interface TabSkeletonOption {
  timeout?: number;
  /** 是否要根据父级元素计算偏移 */
  isOffset?: boolean;
  /** 是否置为fixed元素 */
  isFixed?: boolean;
  /** skeleton X轴偏移 不存在则自行根据父容器计算 */
  offsetX?: number;
  /** skeleton Y轴偏移 不存在则自行根据父容器计算 */
  offsetY?: number;
  /** 入场渐显 */
  fadeIn?: boolean;
  /** 入场持续时间 */
  fadeInDuration?: number;
  /** 退场渐隐 */
  fadeOut?: boolean;
  /** 退场渐隐 */
  fadeOutDuration?: number;
  /** skeleton高度超出屏幕 default true */
  fullScreen?: boolean;
  /** skeleton高度超出屏幕举例 default 100 */
  fullScreenBuffer?: number;
  /** 背景色 */
  background?: string;
  /** default 101 */
  zIndex?: number;
}
