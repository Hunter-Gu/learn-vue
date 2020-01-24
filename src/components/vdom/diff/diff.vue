<template>
  <div :id="id"></div>
</template>

<script>
import { query } from "@/learn-vue/vdom/constant";
import { h } from "@/learn-vue/vdom/h";
import { render } from "@/learn-vue/vdom/render";

export default {
  name: "Diff",
  data() {
    return {
      id: "diff-container"
    };
  },
  mounted() {
    const container = query(`#${this.id}`);
    const vnode = h(
      "ul",
      null,
      [1, 2, 3, 4].map(e => h("li", { key: e, class: e }, e))
    );
    render(vnode, container);

    setTimeout(() => {
      const newVnode = h(
        "ul",
        null,
        [2, 3, 1, 5, 6, 7].map(e => h("li", { key: e, class: e }, e))
      );
      render(newVnode, container);
    }, 3000);
  }
};
</script>
