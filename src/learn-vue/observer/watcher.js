import get from "../utils/get";
import Dep from "./dep";

export default class Watcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm;
    this.getter = parsePath(expOrFn);
    this.cb = cb;
    this.get();
  }

  get() {
    pushTarget(this);
    this.value = this.getter(this.vm);
    popTarget();
  }

  update() {
    const newVal = this.getter(this.vm);
    this.cb(newVal, this.value);
    this.value = newVal;
  }
}

function parsePath(path) {
  return target => get(target, path);
}

function pushTarget(watcher) {
  Dep.target = watcher;
}

function popTarget() {
  Dep.target = null;
}
