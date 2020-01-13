export default class Dep {
  constructor() {
    this.subs = [];
  }

  depend() {
    if (Dep.target && this.subs.indexOf(Dep.target) === -1) {
      this.subs.push(Dep.target);
    }
  }

  notify() {
    for (let i = 0; i < this.subs.length; i++) {
      const watcher = this.subs[i];
      watcher.update();
    }
  }
}
