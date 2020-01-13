import Dep from "./dep";

/**
 * @description make obj[key] reactive
 * @param {*} obj
 * @param {*} key
 */
export function defineReactive(obj, key, val) {
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      dep.depend();

      return val;
    },
    set(newVal) {
      if (newVal === val) return;

      val = newVal;

      dep.notify();
    }
  });
}
