import { isFucntionalComp, isFunction } from "../utils/util";
import { ELEMENT_TYPE, FRAGMENT, PORTAL, CHILDREN_TYPE, SVG } from "./constant";

export function h(tag, data, children) {
  return {
    tag,
    vnodeFlag: getVnodeFlagByTag(tag),
    data,
    ...initChildren(children)
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

function initChildren(children) {
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
    children
  };
}
