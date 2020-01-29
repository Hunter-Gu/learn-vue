<template>
  <div :id="id"></div>
</template>

<script>
import { h } from "@/learn-vue/vdom/h";
import { render } from "@/learn-vue/vdom/render";
import { PORTAL } from "@/learn-vue/vdom/constant";
import { query } from "@/learn-vue/platform/web";

export default {
  name: "RenderPortal",
  data() {
    return {
      id: "render-portal-container"
    };
  },
  mounted() {
    const container = query(`#${this.id}`);
    const portalVnode = h(PORTAL, null, h("span"));
    portalVnode.target = container;
    render(portalVnode, container);
  }
};
</script>
