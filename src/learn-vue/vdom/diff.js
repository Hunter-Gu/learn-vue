import { patch } from "./patch";
import { mount } from "./render";

/**
 * @description 只在 children.length > 1 并且 prevChildren.length > 1 时有效
 *              将新、 旧 children 中相同位置的节点进行 `patch()` 操作， 节省“移除”和“创建”操作
 * @warn 注意， 只适用于新、 旧 children 长度相同的情况
 */
export function diff(children, prevChildren, container) {
  const len =
    children.length < prevChildren.length ? children.length : prevChildren;
  // 先处理较小的值
  for (let i = 0; i < len; i++) {
    patch(children[i], prevChildren[i], container);
  }

  // 对剩下的进行操作， 挂载新的或者移除旧的
  if (children.length > prevChildren.length) {
    for (let i = len; i < children.length; i++) {
      mount(children[i], container);
    }
  } else {
    for (let i = len; i < prevChildren.length; i++) {
      container.removeChild(prevChildren[i].$el);
    }
  }
}
