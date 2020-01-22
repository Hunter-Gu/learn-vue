<template>
  <div :id="id"></div>
</template>

<script>
import { query } from "@/learn-vue/vdom/constant";
import { h } from "../../../learn-vue/vdom/h";
import { render } from "../../../learn-vue/vdom/render";

export default {
  name: "PatchChildren",
  data() {
    return {
      id: "patch-children-container"
    };
  },
  mounted() {
    const container = query(`#${this.id}`);
    const vnode = h("div", null, h("p"));
    render(vnode, container);

    setTimeout(() => {
      const newVnode = h("div", null, h("span"));
      render(newVnode, container);
    }, 3000);
  }
};
</script>
