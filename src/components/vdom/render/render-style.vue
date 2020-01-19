<template>
  <div :id="id"></div>
</template>

<script>
import { h } from "@/learn-vue/vdom/h";
import { render } from "@/learn-vue/vdom/render";
import { query } from "@/learn-vue/vdom/constant";

export default {
  name: "RenderStyle",
  data() {
    return {
      id: "render-style-container"
    };
  },
  mounted() {
    const container = query(`#${this.id}`);
    const htmlVnode = h("div", {
      class: this.id,
      style: {
        width: "100px",
        height: "100px"
      }
    });
    render(htmlVnode, container);
  }
};
</script>
