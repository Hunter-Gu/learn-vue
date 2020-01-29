<template>
  <div :id="id"></div>
</template>

<script>
import { h } from "@/learn-vue/vdom/h";
import { render } from "@/learn-vue/vdom/render";
import { query } from "@/learn-vue/platform/web";

export default {
  name: "RenderEvents",
  data() {
    return {
      id: "render-events-container"
    };
  },
  mounted() {
    const container = query(`#${this.id}`);
    const htmlVnode = h("input", {
      class: this.id,
      events: {
        click(event) {
          event.target.value = "clicked";
        }
      }
    });
    render(htmlVnode, container);
  }
};
</script>
