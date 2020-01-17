import { mount } from "./render";
import {
  ELEMENT_TYPE,
  IS_HTML_ELEMENT,
  IS_COMPONENT_ELEMENT
} from "./constant";

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
    _patchPortal(vnode, prevVnode, container);
  } else if (vnodeFlag & ELEMENT_TYPE.FRAGMENT) {
    _patchFragment(vnode, prevVnode, container);
  } else if (vnodeFlag & ELEMENT_TYPE.TEXT) {
    _patchText(vnode, prevVnode, container);
  }
}

function _patchElement(vnode, prevVnode, container) {
  console.log(vnode, prevVnode, container);
}

function _patchComponent(vnode, prevVnode, container) {
  console.log(vnode, prevVnode, container);
}

function _patchPortal(vnode, prevVnode, container) {
  console.log(vnode, prevVnode, container);
}

function _patchFragment(vnode, prevVnode, container) {
  console.log(vnode, prevVnode, container);
}

function _patchText(vnode, prevVnode, container) {
  console.log(vnode, prevVnode, container);
}

function replaceVNode(vnode, prevVNode, container) {
  container.removeChild(prevVNode.$el);
  mount(vnode, container);
}
