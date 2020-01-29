import { mount, _mountChildren } from "./render";
import {
  ELEMENT_TYPE,
  IS_HTML_ELEMENT,
  IS_COMPONENT_ELEMENT,
  CHILDREN_TYPE
} from "./constant";
import { patchVnodeData } from "./vnode-data";
import { diff } from "./diff";
import { query, removeChild, setText } from "@/learn-vue/platform/web";

export function patch(vnode, prevVnode, container) {
  const { vnodeFlag } = vnode;
  const { vnodeFlag: prevVNodeFlag } = prevVnode;

  if (vnodeFlag !== prevVNodeFlag) {
    replaceVNode(vnode, prevVnode, container);
  } else if (vnodeFlag & IS_HTML_ELEMENT) {
    _patchElement(vnode, prevVnode, container);
  } else if (vnodeFlag & IS_COMPONENT_ELEMENT) {
    _patchComponent(vnode, prevVnode, container);
  } else if (vnodeFlag & ELEMENT_TYPE.PORTAL) {
    _patchPortal(vnode, prevVnode);
  } else if (vnodeFlag & ELEMENT_TYPE.FRAGMENT) {
    _patchFragment(vnode, prevVnode, container);
  } else if (vnodeFlag & ELEMENT_TYPE.TEXT) {
    _patchText(vnode, prevVnode);
  }
}

function _patchElement(vnode, prevVnode, container) {
  if (vnode.tag !== prevVnode.tag) {
    replaceVNode(vnode, prevVnode, container);
  } else {
    const { data } = vnode;
    const { data: prevData } = prevVnode;
    const el = (vnode.$el = prevVnode.$el);
    patchVnodeData(data, prevData, el);
  }

  const { childFlag, children } = vnode;
  const {
    childFlag: prevChildFlag,
    children: prevChildren,
    $el: el
  } = prevVnode;
  _patchChildren(childFlag, prevChildFlag, children, prevChildren, el);
}

function _patchComponent(vnode, prevVnode, container) {
  if (vnode.tag !== prevVnode.tag) {
    replaceVNode(vnode, prevVnode, container);
  } else if (vnode.vnodeFlag & ELEMENT_TYPE.NORMAL_COMPONENT_ELEMENT) {
    const instance = (vnode.$instance = prevVnode.$instance);
    instance.$props = vnode.data.props;
    instance._update();
  } else {
    const handle = (vnode.handle = prevVnode.handle);
    handle.prev = prevVnode;
    handle.next = vnode;
    handle.container = container;
    handle.update();
  }
}

function _patchPortal(vnode, prevVnode) {
  let { childFlag, children, target } = vnode;
  let {
    childFlag: prevChildFlag,
    children: prevChildren,
    target: prevTarget
  } = prevVnode;
  target = typeof target === "string" ? query(target) : target;
  prevTarget = typeof prevTarget === "string" ? query(prevTarget) : prevTarget;

  if (target !== prevTarget) {
    // TODO: remove some children maybe unnecessary
    // TODO: could optimized by only append same children to target
    // move children from prev target
    _patchChildren(
      CHILDREN_TYPE.NO_CHILDREN,
      prevChildFlag,
      [],
      prevChildren,
      prevTarget
    );
    // append children to target
    _patchChildren(childFlag, CHILDREN_TYPE.NO_CHILDREN, children, [], target);
  } else {
    _patchChildren(childFlag, prevChildFlag, children, prevChildren, target);
  }
}

function _patchFragment(vnode, prevVnode, container) {
  let { childFlag, children } = vnode;
  let { childFlag: prevChildFlag, children: prevChildren } = prevVnode;
  _patchChildren(childFlag, prevChildFlag, children, prevChildren, container);
}

function _patchText(vnode, prevVnode) {
  const el = (vnode.$el = prevVnode.$el);
  // modify type of `TEXT_NODE` node's content by domProp `nodeValue`
  // and text is created by `createTextNode()` API in virtual dom
  if (vnode.children !== prevVnode.children) {
    setText(el, vnode.children);
  }
}

function replaceVNode(vnode, prevVNode, container) {
  removeChild(container, prevVNode.$el);
  mount(vnode, container);
}

function _patchChildren(
  childFlag,
  prevChildFlag,
  children,
  prevChildren,
  container
) {
  if (childFlag & CHILDREN_TYPE.NO_CHILDREN) {
    // have no new children
    prevChildren
      .map(child => child.$el)
      .forEach(el => removeChild(container, el));
  } else if (prevChildFlag & CHILDREN_TYPE.NO_CHILDREN) {
    // only have new children and have no old children
    _mountChildren(childFlag, children, container);
  } else if (childFlag & prevChildFlag & CHILDREN_TYPE.SINGLE_CHILDREN) {
    // both have one new children and one old children
    patch(children[0], prevChildren[0], container);
  } else {
    diff(children, prevChildren, container);
  }
}
