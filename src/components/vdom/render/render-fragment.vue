<template>
  <div :id="id"></div>
</template>

<script>
import { h } from "@/learn-vue/vdom/h";
import { render } from "@/learn-vue/vdom/render";
import { FRAGMENT } from "@/learn-vue/vdom/constant";
import { query } from "@/learn-vue/platform/web";

export default {
  name: "RenderFragment",
  data() {
    return {
      id: "render-fragment-container"
    };
  },
  mounted() {
    const container = query(`#${this.id}`);
    const fragmentVnode = h(FRAGMENT, null, [h("span"), h("p")]);
    render(fragmentVnode, container);
  }
};
</script>
