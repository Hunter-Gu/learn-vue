<template>
  <div :id="id">{{ text }}</div>
</template>

<script>
import { query } from "@/learn-vue/platform/web";
import { h } from "../../../learn-vue/vdom/h";
import { render } from "../../../learn-vue/vdom/render";

export default {
  name: "PatchEvents",
  data() {
    return {
      id: "patch-events-container",
      text: ""
    };
  },
  mounted() {
    const container = query(`#${this.id}`);
    let cnt = 0;
    const handler = text => (this.text = text + cnt++);
    const commonEvent = _ => _;
    const vnode = h("div", {
      class: this.id,
      events: {
        click: () => {
          handler("before");
        },
        mouseEnter: commonEvent
      }
    });
    render(vnode, container);

    setTimeout(() => {
      const newVnode = h("div", {
        class: this.id,
        events: {
          click: () => {
            handler("after");
          },
          mouseEnter: commonEvent
        }
      });
      render(newVnode, container);
    }, 3000);
  }
};
</script>

<style>
.patch-events-container {
  width: 100px;
  height: 100px;
  background: blue;
}
</style>
