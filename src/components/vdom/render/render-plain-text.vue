<template>
  <div :id="id"></div>
</template>

<script>
import { h } from "@/learn-vue/vdom/h";
import { render } from "@/learn-vue/vdom/render";
import { query } from "@/learn-vue/vdom/constant";

export default {
  name: "RenderPlainText",
  data() {
    return {
      id: "render-plain-text-container"
    };
  },
  mounted() {
    const container = query(`#${this.id}`);
    const plainTextVnode = h(null, null, "1234");

    render(plainTextVnode, container);
  }
};
</script>
