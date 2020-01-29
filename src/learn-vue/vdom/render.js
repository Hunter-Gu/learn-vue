import {
  ELEMENT_TYPE,
  IS_HTML_ELEMENT,
  IS_COMPONENT_ELEMENT,
  CHILDREN_TYPE
} from "./constant";
import { initVnodeData } from "./vnode-data";
import { patch } from "./patch";
import {
  query,
  createElement,
  createTextNode,
  removeChild,
  insertBefore,
  appendChild
} from "@/learn-vue/platform/web";

export function render(vnode, container) {
  const { vnode: preVnode } = container;
  if (preVnode) {
    if (vnode) {
      patch(vnode, preVnode, container);
    } else {
      removeChild(container, preVnode.$el);
    }
  } else if (vnode) {
    mount(vnode, container);
  }

  container.vnode = vnode || null;
}

export function mount(vnode, container, refNode) {
  const { vnodeFlag } = vnode;

  if (vnodeFlag & IS_HTML_ELEMENT) {
    mountElement(vnode, container, refNode);
  } else if (vnodeFlag & IS_COMPONENT_ELEMENT) {
    mountComponent(vnode, container);
  } else if (vnodeFlag & ELEMENT_TYPE.PORTAL) {
    mountPortal(vnode, container);
  } else if (vnodeFlag & ELEMENT_TYPE.FRAGMENT) {
    mountFragment(vnode, container);
  } else if (vnodeFlag & ELEMENT_TYPE.TEXT) {
    mountText(vnode, container);
  }
}

function mountElement(vnode, container, refNode) {
  const { tag, vnodeFlag, childFlag, children, data } = vnode;

  const isSVG = vnodeFlag & ELEMENT_TYPE.SVG_ELEMENT;

  const el = (vnode.$el = createElement(tag, isSVG));

  initVnodeData(data, el);
  _mountChildren(childFlag, children, el);

  if (refNode) {
    insertBefore(container, el, refNode);
  } else {
    appendChild(container, el);
  }
}

function mountComponent(vnode, container) {
  const { vnodeFlag } = vnode;

  if (vnodeFlag & ELEMENT_TYPE.NORMAL_COMPONENT_ELEMENT) {
    _mountStatefulComponent(vnode, container);
  } else if (vnodeFlag & ELEMENT_TYPE.FUNCTIONAL_COMPONENT) {
    _mountFunctionalComponent(vnode, container);
  }
}

/**
 * @description stateful component, 类式组件， 该组件相当于 extends 了下方注释的 `StatefulComponent`
 * @type
 *    abstract class StatefulComponent {
 *      // 执行第一次 `render()` 后， 会被置为 true
 *      _mounted = false
 *
 *      $props // 从父组件获取的 props
 *
 *      abstract render() {}
 *
 *      private _update() {
 *        // 组件更新时会被调用
 *        // 不能被 override
 *      }
 *    }
 */
function _mountStatefulComponent(vnode, container) {
  const { tag, data } = vnode;
  const instance = (vnode.$instance = new tag());
  instance.$props = data.props || {};
  /**
   * @description 用于方便组件更新， 组件更新时： 1.需要重新生成 vnode 对象 2. patch
   *    - 1.主动更新： 组件自身数据改变
   *    - 2.被动更新： 组件依赖的外部数据改变， 如从父组件获取的 props
   */
  instance._update = function() {
    if (instance._mounted) {
      const preVnode = instance.vnode;
      const nextVnode = (instance.vnode = instance.render());
      patch(nextVnode, preVnode, container);
    } else {
      instance.vnode = instance.render();
      mount(instance.vnode, container);
      instance._mounted = true;
    }
    instance.$el = vnode.$el = instance.vnode.$el;
  };

  instance._update();
}

/**
 * @description 函数式（无状态）组件， 只会被动更新
 * @param {*} vnode
 * @param {*} container
 */
function _mountFunctionalComponent(vnode, container) {
  const { tag } = vnode;
  vnode.handle = {
    prev: null,
    next: vnode,
    container,
    update: () => {
      const { data } = vnode.handle.next;
      if (vnode.handle.prev) {
        const { prev, next } = vnode.handle;
        const { $tree: preVnode } = prev;
        const nextVnode = (next.$tree = tag(data.props || {}));
        patch(nextVnode, preVnode, container);
      } else {
        const $vnode = (vnode.$tree = tag(data.props || {}));
        mount($vnode, container);
        vnode.$el = $vnode.$el;
      }
    }
  };

  vnode.handle.update();
}

function mountPortal(vnode) {
  const { target: targetTag, childFlag, children } = vnode;
  const target = typeof targetTag === "string" ? query(targetTag) : targetTag;
  _mountChildren(childFlag, children, target);
}

function mountFragment(vnode, container) {
  const { childFlag, children } = vnode;
  _mountChildren(childFlag, children, container);
}

function mountText(vnode, container) {
  const el = (vnode.$el = createTextNode(vnode.children));

  appendChild(container, el);
}

export function _mountChildren(childFlag, children, container) {
  if (childFlag & CHILDREN_TYPE.SINGLE_CHILDREN) {
    mount(children[0], container);
  } else if (childFlag & CHILDREN_TYPE.MULTIPLE_CHILDREN) {
    children.forEach(child => mount(child, container));
  } else {
    appendChild(container, createTextNode(""));
  }
}
