<template>
  <div :id="id">
    <div :class="id + i" v-for="i in 2" :key="i"></div>
  </div>
</template>

<script>
import { PORTAL } from "@/learn-vue/vdom/constant";
import { h } from "../../../learn-vue/vdom/h";
import { render } from "../../../learn-vue/vdom/render";
import { query } from "@/learn-vue/platform/web";

export default {
  name: "PatchPortal",
  data() {
    return {
      id: "patch-portal-container"
    };
  },
  mounted() {
    const container = query(`#${this.id}`);
    const vnode = h(PORTAL, null, [h("span"), h("a")]);
    vnode.target = "." + this.id + "1";
    render(vnode, container);
    setTimeout(() => {
      const newVNode = h(PORTAL, null, [h("p"), h("span")]);
      newVNode.target = "." + this.id + "2";
      render(newVNode, container);
    }, 3000);
  }
};
</script>
