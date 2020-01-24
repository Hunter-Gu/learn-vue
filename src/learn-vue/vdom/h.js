import { isFucntionalComp, isFunction } from "../utils/util";
import { ELEMENT_TYPE, FRAGMENT, PORTAL, CHILDREN_TYPE, SVG } from "./constant";
import get from "../utils/get";
/**

type tag = string | Component | functionalComp;

type children = BaseVNode | BaseVNode[]

type h = (tag: tag, data: VNodeData, children: children) => VNode;

type functionalComp = (h?: h) => BaseVNode

interface Component {
  render: (h?: h) => BaseVNode
}

interface VNodeData {
  attrs: Object;
  props: Object;
  style: Object;
  class: string
  events: Object;
}

interface VNode {
  $el: HTMLElement;
  _isVNode: true;
  tag: tag
  vnodeFlag;
  data: VNodeData;
  childFlag;
  key: string; // 在对 children 进行 patch 时的 diff 算法所需
  children: children,
  target: string | HTMLElement,
  $instance: StatefulComp; // 类式组件特有， 用于保存当前组件实例
  handle?: Handle; // 函数式组件特有
  $tree?: VNode; // 函数式组件特有， 保存函数式组件生成的 VNode 对象
}

interface Instance {
  $props: Object;
  $el: HTMLElement;
  _mounted: boolean;
  vnode: VNode;
  _update: () => void
  render: () => VNode
}

interface Handle {
  prev: VNode;
  next: VNode;
  container: HTMLElement,
  update: () => void; // 更新函数式组件状态
}

type BaseVNode = Omit<VNode, 'vnodeFlag' | 'childFlag'>
*/

export function h(tag, data, children) {
  const vnodeFlag = getVnodeFlagByTag(tag);
  const isTextVNode = tag === null && vnodeFlag & ELEMENT_TYPE.TEXT;
  return {
    _isVNode: true,
    tag,
    vnodeFlag,
    key: get(data, "key", null),
    data: data || {},
    ...initChildren(children, isTextVNode)
  };
}

function getVnodeFlagByTag(tag) {
  let vnodeFlag;

  if (typeof tag === "string") {
    vnodeFlag =
      tag === SVG ? ELEMENT_TYPE.SVG_ELEMENT : ELEMENT_TYPE.HTML_ELEMENT;
  } else if (tag === FRAGMENT) {
    vnodeFlag = ELEMENT_TYPE.FRAGMENT;
  } else if (tag === PORTAL) {
    vnodeFlag = ELEMENT_TYPE.PORTAL;
  } else if (isFucntionalComp(tag)) {
    vnodeFlag = ELEMENT_TYPE.FUNCTIONAL_COMPONENT;
  } else if (isFunction(tag)) {
    vnodeFlag = ELEMENT_TYPE.NORMAL_COMPONENT_ELEMENT;
  } else {
    vnodeFlag = ELEMENT_TYPE.TEXT;
  }

  return vnodeFlag;
}

function initChildren(children, isTextVNode) {
  let childFlag;

  if (Array.isArray(children)) {
    const { length } = children;
    if (!length) {
      childFlag = CHILDREN_TYPE.NO_CHILDREN;
    } else if (length === 1) {
      childFlag = CHILDREN_TYPE.SINGLE_CHILDREN;
    } else {
      childFlag = CHILDREN_TYPE.MULTIPLE_CHILDREN;
    }
  } else if (children) {
    childFlag = CHILDREN_TYPE.SINGLE_CHILDREN;
    children = [children];
  } else {
    childFlag = CHILDREN_TYPE.NO_CHILDREN;
    children = [];
  }

  return {
    childFlag,
    children: !isTextVNode ? normalizeVNodes(children) : children
  };
}

function normalizeVNodes(children) {
  return children.map(child => {
    if (!child._isVNode) {
      // TODO: refactor code for better DRY
      return {
        tag: null,
        children: [child],
        vnodeFlag: ELEMENT_TYPE.TEXT,
        data: null,
        _isVNode: true,
        childFlag: CHILDREN_TYPE.SINGLE_CHILDREN
      };
    } else {
      return child;
    }
  });
}
