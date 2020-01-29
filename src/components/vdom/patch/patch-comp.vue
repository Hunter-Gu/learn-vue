<template>
  <div :id="id">
    <div v-for="i in 2" :id="id + '-' + i" :key="i"></div>
  </div>
</template>

<script>
import { query } from "@/learn-vue/platform/web";
import { h } from "../../../learn-vue/vdom/h";
import { render } from "../../../learn-vue/vdom/render";

const BEFORE = "before";
const AFTER = "after";

export default {
  name: "PatchComp",
  data() {
    return {
      id: "patch-comp-container"
    };
  },
  mounted() {
    this.activeUpdate();
    this.passiveUpdate();
  },
  methods: {
    activeUpdate() {
      const container = query(`#${this.id}-1`);
      const self = this;

      class StatefulComp {
        id = "stateful-comp-" + BEFORE;

        render() {
          // 内部变量， 用于表示是否已经挂载该组件
          // 已经挂载后， 之后需要更新时就进行 patch 操作， 而不是 mount 操作
          if (!this._mounted) {
            setTimeout(() => {
              this.id = this.id.replace(BEFORE, AFTER);
              // 内部方法， 组件状态改变后， 调用该方法， 从而对视图进行更新
              this._update();
            }, 3000);
          }

          return h("span", {
            class: `${self.id} ${this.id}`
          });
        }
      }

      render(h(StatefulComp), container);
    },
    passiveUpdate() {
      const container = query(`#${this.id}-2`);

      class StatefulComp {
        render() {
          return h("span", {
            class: this.$props.classname
          });
        }
      }

      const vnode = h(StatefulComp, {
        props: {
          classname: BEFORE
        }
      });

      render(vnode, container);

      setTimeout(() => {
        const newVnode = h(StatefulComp, {
          props: {
            classname: AFTER
          }
        });
        render(newVnode, container);
      }, 3000);
    }
  }
};
</script>
