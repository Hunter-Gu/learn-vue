<template>
  <div :id="id"></div>
</template>

<script>
import { h } from "@/learn-vue/vdom/h";
import { render } from "@/learn-vue/vdom/render";
import { query } from "@/learn-vue/platform/web";

export default {
  name: "RenderProps",
  data() {
    return {
      id: "render-props-container"
    };
  },
  mounted() {
    const container = query(`#${this.id}`);
    const htmlVnode = h("input", {
      class: this.id,
      props: {
        type: "radio",
        checked: true
      }
    });
    render(htmlVnode, container);
  }
};
</script>
