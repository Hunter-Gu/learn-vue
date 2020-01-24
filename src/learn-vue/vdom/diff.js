import { patch } from "./patch";

/**
 * @description 寻找最大索引， 该方式以 children 中的第一个节点为基准
 */
export function diff(children, prevChildren, container) {
  // 最大索引
  let lastIndex = 0;
  for (let i = 0; i < children.length; i++) {
    const vnode = children[i];
    for (let j = 0; j < prevChildren.length; j++) {
      const prevVnode = prevChildren[j];
      if (vnode.key === prevVnode.key) {
        patch(vnode, prevVnode, container);
        if (j < lastIndex) {
          // 节点被移动了
          // prev       a b c
          // next           c b a
          // idx            2 1 0
          // lastIndex      2 2 2

          // 1.children 中的第一个节点不处理
          // 2.之后的节点， 插入到第一个节点的后面
          // 为什么需要 nextSibling？
          // 因为新节点需要插到第一个节点的后面， 也就是第一个节点的下一个兄弟节点的前面
          const refNode = children[i - 1].$el.nextSibling;
          container.insertBefore(prevVnode.$el, refNode);
        } else {
          lastIndex = j;
        }
      }
    }
  }
}
