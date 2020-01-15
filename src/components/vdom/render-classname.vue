<template>
  <div :id="id"></div>
</template>

<script>
import { h } from "@/learn-vue/vdom/h";
import { render } from "@/learn-vue/vdom/render";
import { query } from "@/learn-vue/vdom/constant";

export default {
  name: "RenderClassName",
  data() {
    return {
      id: "render-classname-container"
    };
  },
  mounted() {
    const container = query(`#${this.id}`);
    const htmlVnode = h("div", {
      class: this.id
    });
    render(htmlVnode, container);
  }
};
</script>

<style lang="scss" scoped></style>
