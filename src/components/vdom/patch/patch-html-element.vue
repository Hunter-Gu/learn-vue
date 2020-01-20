<template>
  <div :id="id"></div>
</template>

<script>
import { query } from "@/learn-vue/vdom/constant";
import { h } from "../../../learn-vue/vdom/h";
import { render } from "../../../learn-vue/vdom/render";

export default {
  name: "PatchHtmlElement",
  data() {
    return {
      id: "patch-html-element-container"
    };
  },
  mounted() {
    const container = query(`#${this.id}`);
    const vnode = h("p");
    render(vnode, container);

    setTimeout(() => {
      const newVnode = h("a");
      render(newVnode, container);
    }, 3000);
  }
};
</script>
