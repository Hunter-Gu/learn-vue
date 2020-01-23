/* istanbul ignore next */
export function isFunction(target) {
  return typeof target === "function";
}

/* istanbul ignore next */
export function isObject(target) {
  return target !== null && typeof target === "object";
}

/* istanbul ignore next */
export function isUndef(val) {
  return typeof val === "undefined";
}

const KEY_FUNCTIONAL = "functional";
/* istanbul ignore next */
export function isFucntionalComp(target) {
  return isFunction(target) && target[KEY_FUNCTIONAL];
}

/* istanbul ignore next */
export function hasOwn(target, key) {
  return Object.prototype.hasOwnProperty.call(target, key);
}

/* istanbul ignore next */
export function isNil(val) {
  return val === null || isUndef(val);
}
