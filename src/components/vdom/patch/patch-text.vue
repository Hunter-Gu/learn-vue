<template>
  <div :id="id"></div>
</template>

<script>
import { query } from "@/learn-vue/platform/web";
import { h } from "../../../learn-vue/vdom/h";
import { render } from "../../../learn-vue/vdom/render";

export default {
  name: "PatchText",
  data() {
    return {
      id: "patch-text-container"
    };
  },
  mounted() {
    const text = "hello world";
    const container = query(`#${this.id}`);
    const vnode = h(
      "div",
      {
        class: this.id
      },
      text
    );
    render(vnode, container);

    setTimeout(() => {
      const newVnode = h(
        "div",
        {
          class: this.id
        },
        text.toUpperCase()
      );
      render(newVnode, container);
    }, 3000);
  }
};
</script>
