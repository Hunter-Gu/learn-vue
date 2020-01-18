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
export function isFucntionalComp(target) {
  return isFunction(target) && target[KEY_FUNCTIONAL];
}

export function hasOwn(target, key) {
  return Object.prototype.hasOwnProperty.call(target, key);
}
