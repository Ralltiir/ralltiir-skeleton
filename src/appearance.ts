/*
 * @Author: qiansc
 * @Date: 2018-12-07 12:23:06
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-12-20 10:37:08
 */

export interface SkeletonAppearance {
  /** 渲染Appearance */
  render: (option: SkeletonAppearanceOptions) => HTMLElement;
  /** 销毁Appearance */
  destroy: () => void;
}

export interface SkeletonAppearanceOptions {
  target: HTMLElement;
  /** Skeleton父容器相对窗口Y轴偏移 */
  offsetY?: number;
  /** Skeleton父容器相对窗口X轴偏移 */
  offsetX?: number;
}
