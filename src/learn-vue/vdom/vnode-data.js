import { VNODE_DATA_KEY } from "./constant";
import { isFunction, hasOwn } from "../utils/util";

const DEFAULT_KEY = "default";

export function initVnodeData(data, el) {
  handleVnodeData({
    [VNODE_DATA_KEY.CLASS]: _initClass,
    [VNODE_DATA_KEY.STYLE]: _initStyle,
    [VNODE_DATA_KEY.ATTRS]: _initAttrs,
    [VNODE_DATA_KEY.PROPS]: _initProps,
    [VNODE_DATA_KEY.EVENTS]: _initEvents,
    DEFAULT_KEY(el, data, key) {
      console.log(`can't init key ${key}`);
    }
  })(data, el);
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

export function patchVnodeData(data, prevData, el) {
  handleVnodeData({
    [VNODE_DATA_KEY.CLASS]: _patchClass,
    [VNODE_DATA_KEY.STYLE]: _patchStyle,
    [VNODE_DATA_KEY.ATTRS]: _patchAttrs,
    [VNODE_DATA_KEY.PROPS]: _patchProps,
    [VNODE_DATA_KEY.EVENTS]: _patchEvents,
    DEFAULT_KEY(el, data, key) {
      console.log(`can't patch key ${key}`);
    }
  })(data, el, prevData);
}

function _patchClass(el, cls, prevCls) {
  if (cls !== prevCls) {
    el.className = cls;
  }
}

function _patchStyle(el, style, prevStyle) {
  const { style: elmStyle } = el;
  _patchObject(
    style,
    prevStyle,
    (key, value) => {
      elmStyle[key] = value;
    },
    key => {
      elmStyle[key] = "";
    }
  );
}

function _patchAttrs(el, attrs, prevAttrs) {
  _patchObject(
    attrs,
    prevAttrs,
    (key, value) => {
      el.setAttribute(key, value);
    },
    key => {
      el.removeAttribute(key);
    }
  );
}

function _patchProps(el, props, prevProps) {
  _patchObject(
    props,
    prevProps,
    (key, value) => {
      el[key] = value;
    },
    key => {
      delete el[key];
    }
  );
}

function _patchEvents(el, events, prevEvents) {
  _patchObject(
    events,
    prevEvents,
    (key, handler) => {
      el.addEventListener(key, handler);
    },
    (key, handler) => {
      el.removeEventListener(key, handler);
    }
  );
}

function _patchObject(data, prevData, setter, deleter) {
  const isOwnKey = (obj, key) => {
    return key in obj && hasOwn(obj, key);
  };
  const handleOwnKeys = (obj, handler) => {
    for (let k in obj && isOwnKey(obj, k)) {
      handler(k, obj[k]);
    }
  };
  // delete keys exist in prevData but don't exist in data
  handleOwnKeys(prevData, (k, v) => {
    if (!isOwnKey(data, k)) {
      deleter(k, v);
    }
  });
  // set keys exist in data
  handleOwnKeys(data, (k, v) => {
    setter(k, v);
  });
}

function handleVnodeData(hooks) {
  return function(data, el, prevData = {}) {
    if (data) {
      for (let key in data) {
        const value = data[key];

        switch (key) {
          case VNODE_DATA_KEY.CLASS:
          case VNODE_DATA_KEY.STYLE:
          case VNODE_DATA_KEY.ATTRS:
          case VNODE_DATA_KEY.PROPS:
          case VNODE_DATA_KEY.EVENTS:
            _callHook(key, hooks)(el, value, prevData[key]);
            break;
          default:
            _callHook(DEFAULT_KEY, hooks)(el, value, key, prevData);
            break;
        }
      }
    }
  };
}

function _callHook(hookName, hooks) {
  return (...args) => {
    if (isFunction(hooks[hookName])) {
      hooks[hookName](...args);
    }
  };
}