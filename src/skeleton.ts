/*
 * @Author: qiansc
 * @Date: 2018-12-06 16:04:08
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-12-10 13:40:57
 */
/**
 * skeleton的生命周期 init > create [> pause] [> resume] > destroy
 * skeleton主要是面向rt-transition or service的抽象
 * skeleton实际渲染
 */
import { SkeletonAppearance } from "./appearance";
const TargetClass = "rt-skeleton";

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

  public destroy(): void {
    if (this.destried) {
      return;
    }
    this.destroying = true;
    this.tryDestroy();
  }

  public pause(): void {
    this.paused = true;
  }

  public resume(): void {
    this.paused = false;
    this.tryDestroy();
  }
  private initContent() {
    const offset = this.offset();
    this.target.className = TargetClass;
    this.target.style.position = "absolute";
    this.target.style.width = "100%";
    this.target.style.top = (this.options.isFixed ? offset.y + "px" : 0).toString();
    this.target.style.left = "0";
    if (this.options.background) {
      this.target.style.background = this.options.background;
    }
    if (this.options.fadeOut) {
      const duration = (this.options.fadeOutDuration || 400) / 1000;
      this.target.style.transition = `opacity ${duration}s linear`;
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
        if (this.options.fadeOut) {
          this.target.className += " sk-fadeout";
          this.target.addEventListener("transitionend", () => {
            this.app.destroy();
            this.removeTarget();
          });
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
    }
    const old = this.container.querySelectorAll(`.${TargetClass}`);
    old.forEach((item) => {
      this.container.removeChild(item);
    });
  }
  private offset() {
    if (this.options.isOffset && this.container && this.container.getBoundingClientRect) {
      const rect = this.container.getBoundingClientRect();
      return {
        x: rect.left,
        y: rect.top,
      };
    }
    return {x: 0, y: 0};
  }
}

interface TabSkeletonOption {
  timeout?: number;
  isOffset?: boolean;
  isFixed?: boolean;
  fadeIn?: boolean;
  fadeInDuration?: number;
  fadeOut?: boolean;
  fadeOutDuration?: number;
  /** default true */
  fullScreen?: boolean;
  fullScreenBuffer?: number;
  background?: string;
}
