<template>
  <div :id="id"></div>
</template>

<script>
import { query, FRAGMENT } from "@/learn-vue/vdom/constant";
import { h } from "../../../learn-vue/vdom/h";
import { render } from "../../../learn-vue/vdom/render";

export default {
  name: "PatchFragment",
  data() {
    return {
      id: "patch-fragment-container"
    };
  },
  mounted() {
    const container = query(`#${this.id}`);
    const vnode = h(FRAGMENT, null, [h("span"), h("span")]);
    render(vnode, container);
    setTimeout(() => {
      const newVnode = h(FRAGMENT, null, [h("p"), h("p")]);
      render(newVnode, container);
    }, 3000);
  }
};
</script>
