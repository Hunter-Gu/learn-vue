import { VNODE_DATA_KEY } from "./constant";

export function initVnodeData(vnode) {
  const { data, $el: el } = vnode;

  if (data) {
    for (let key in data) {
      const value = data[key];
      switch (key) {
        case VNODE_DATA_KEY.CLASS:
          _initClass(el, value);
          break;
        case VNODE_DATA_KEY.STYLE:
          _initStyle(el, value);
          break;
        case VNODE_DATA_KEY.ATTRS:
          _initAttrs(el, value);
          break;
        case VNODE_DATA_KEY.PROPS:
          _initProps(el, value);
          break;
        case VNODE_DATA_KEY.EVENTS:
          _initEvents(el, value);
          break;
        default:
          break;
      }
    }
  }
}

function _initClass(el, cls) {
  el.className = cls;
}

function _initStyle(el, style) {
  for (let prop in style) {
    el.style[prop] = style[prop];
  }
}

function _initAttrs(el, attrs) {
  for (let attr in attrs) {
    el.setAttribute(attr, attrs[attr]);
  }
}

function _initProps(el, props) {
  for (let prop in props) {
    el[prop] = props[prop];
  }
}

function _initEvents(el, events) {
  for (let event in events) {
    el.addEventListener(event, events[event]);
  }
}
