/*
 * @Author: qiansc
 * @Date: 2018-12-07 12:23:06
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-12-10 11:36:37
 */

export interface SkeletonAppearance {
  render: (option: SkeletonAppearanceOptions) => HTMLElement;
  destroy: () => void;
}

export interface SkeletonAppearanceOptions {
  target: HTMLElement;
  /** Skeleton父容器相对窗口Y轴偏移 */
  offsetY?: number;
  /** Skeleton父容器相对窗口X轴偏移 */
  offsetX?: number;
}
