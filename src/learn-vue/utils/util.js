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
