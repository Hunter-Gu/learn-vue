<template>
  <div :id="id"></div>
</template>

<script>
import { h } from "@/learn-vue/vdom/h";
import { render } from "@/learn-vue/vdom/render";
import { query } from "@/learn-vue/vdom/constant";

export default {
  name: "RenderHTMLElement",
  data() {
    return {
      id: "render-html-element-container"
    };
  },
  mounted() {
    const container = query(`#${this.id}`);
    const svgVnode = h("svg");
    const htmlElmVnode = h("span", null, svgVnode);

    render(htmlElmVnode, container);
  }
};
</script>

<style lang="scss" scoped></style>
