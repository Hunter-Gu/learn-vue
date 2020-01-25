import { patch } from "./patch";
import { mount } from "./render";

/**
 * @description 双端比较， 从 children 和 prevChildren 的两端开始比较
 *              四个索引：
 *                - 1.oldStartIdx
 *                - 2.oldEndIdx
 *                - 3.newStartIdx
 *                - 4.newEndIdx
 */
export function diff(children, prevChildren, container) {
  let oldStartIdx = 0;
  let oldEndIdx = prevChildren.length - 1;
  let newStartIdx = 0;
  let newEndIdx = children.length - 1;

  let oldStartVnode = prevChildren[oldStartIdx];
  let oldEndVnode = prevChildren[oldEndIdx];
  let newStartVnode = children[newStartIdx];
  let newEndVnode = children[newEndIdx];

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // oldStartIdx 和 oldEndIdx 总会有一个先达到 undefined
    if (!oldStartVnode) {
      oldStartVnode = prevChildren[++oldStartIdx];
    } else if (!oldEndVnode) {
      oldEndVnode = prevChildren[--oldEndIdx];
    } else if (oldStartVnode.key === newStartVnode.key) {
      patch(newStartVnode, oldStartVnode, container);
      // 都是第一个节点， 不需要移动位置
      oldStartVnode = prevChildren[++oldStartIdx];
      newStartVnode = children[++newStartIdx];
    } else if (oldStartVnode.key === newEndVnode.key) {
      patch(newEndVnode, oldStartVnode, container);
      container.insertBefore(oldStartVnode.$el, oldEndVnode.$el.nextSibling);
      oldStartVnode = prevChildren[++oldStartIdx];
      newEndVnode = children[--newEndIdx];
    } else if (oldEndVnode.key === newStartVnode.key) {
      patch(newStartVnode, oldEndVnode, container);
      container.insertBefore(oldEndVnode.$el, oldStartVnode.$el);
      oldEndVnode = prevChildren[--oldEndIdx];
      newStartVnode = children[++newStartIdx];
    } else if (oldEndVnode.key === newEndVnode.key) {
      patch(newEndVnode, oldEndVnode, container);
      // 都是最后一个节点， 不需要移动位置
      oldEndVnode = prevChildren[--oldEndIdx];
      newEndVnode = children[--newEndIdx];
    } else {
      // 处理不是双端元素时， 以 newStartVnode 为基准
      // 核心：
      //      - 对比时， 以 children(newStartVnode) 为基准
      //      - 插入时， 以 prevChildren(oldStartVnode) 为基准
      const idxInOld = prevChildren.findIndex(
        node => node && node.key === newStartVnode.key
      );

      if (idxInOld >= 0) {
        // 将该元素移动到最前面
        const vnode = prevChildren[idxInOld];
        patch(newStartVnode, vnode, container);
        container.insertBefore(vnode.$el, oldStartVnode.$el);
        prevChildren[idxInOld] = undefined;
      } else {
        // 新节点
        mount(newStartVnode, container, oldStartVnode.$el);
      }
      newStartVnode = children[++newStartIdx];
    }
  }
  // 挂载没有被处理的新节点
  if (oldEndIdx < oldStartIdx) {
    for (let i = newStartIdx; i <= newEndIdx; i++) {
      mount(children[i], container, oldStartVnode.$el);
    }
  } else if (newEndIdx < newStartIdx) {
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      container.removeChild(prevChildren[i].$el);
    }
  }
}
