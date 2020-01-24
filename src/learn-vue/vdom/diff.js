import { patch } from "./patch";

/**
 * @description 最佳的方式是通过移动节点来达到目的， 因为这样的场景更多
 *              关键是在新、 旧节点中保存映射关系， 以便找到可复用节点 ---> key
 * @warn 双层 for 循环 T(n) = O(n^2)
 */
export function diff(children, prevChildren, container) {
  for (let i = 0; i < children; i++) {
    const vnode = children[i];
    for (let j = 0; j < prevChildren; j++) {
      const prevVnode = prevChildren[j];
      if (vnode.key === prevVnode.key) {
        patch(vnode, prevVnode, container);
      }
    }
  }
}
