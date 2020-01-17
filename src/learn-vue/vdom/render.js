import {
  ELEMENT_TYPE,
  CHILDREN_TYPE,
  createElement,
  createTextNode,
  query
} from "./constant";
import { initVnodeData } from "./init-vnode-data";

export function render(vnode, container) {
  mount(vnode, container);
}

function mount(vnode, container) {
  const { vnodeFlag } = vnode;

  if (vnodeFlag & (ELEMENT_TYPE.HTML_ELEMENT | ELEMENT_TYPE.SVG_ELEMENT)) {
    mountElement(vnode, container);
  } else if (
    vnodeFlag &
    (ELEMENT_TYPE.FUNCTIONAL_COMPONENT | ELEMENT_TYPE.NORMAL_COMPONENT_ELEMENT)
  ) {
    mountComponent(vnode, container);
  } else if (vnodeFlag & ELEMENT_TYPE.PORTAL) {
    mountPortal(vnode, container);
  } else if (vnodeFlag & ELEMENT_TYPE.FRAGMENT) {
    mountFragment(vnode, container);
  } else if (vnodeFlag & ELEMENT_TYPE.TEXT) {
    mountText(vnode, container);
  }
}

function mountElement(vnode, container) {
  const { tag, vnodeFlag, childFlag, children } = vnode;

  const isSVG = vnodeFlag & ELEMENT_TYPE.SVG_ELEMENT;

  const el = (vnode.$el = isSVG
    ? document.createElementNS("http://www.w3.org/2000/svg", tag)
    : createElement(tag));

  initVnodeData(vnode);
  _mountChildren(childFlag, children, el);
  container.appendChild(el);
}

function mountComponent(vnode, container) {
  const { vnodeFlag } = vnode;

  if (vnodeFlag & ELEMENT_TYPE.NORMAL_COMPONENT_ELEMENT) {
    _mountStatefulComponent(vnode, container);
  } else if (vnodeFlag & ELEMENT_TYPE.FUNCTIONAL_COMPONENT) {
    _mountFunctionalComponent(vnode, container);
  }
}

// class component
function _mountStatefulComponent(vnode, container) {
  const { tag } = vnode;
  const instance = new tag();

  instance.vnode = instance.render();
  mount(instance.vnode, container);
  instance.$el = vnode.$el = instance.vnode.$el;
}

function _mountFunctionalComponent(vnode, container) {
  const { tag } = vnode;
  const $vnode = tag();
  mount($vnode, container);
  vnode.$el = $vnode.$el;
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

  container.appendChild(el);
}

function _mountChildren(childFlag, children, container) {
  if (childFlag & CHILDREN_TYPE.SINGLE_CHILDREN) {
    mount(children[0], container);
  } else if (childFlag & CHILDREN_TYPE.MULTIPLE_CHILDREN) {
    children.forEach(child => mount(child, container));
  } else {
    container.appendChild(createTextNode(""));
  }
}
