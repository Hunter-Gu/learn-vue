<template>
  <div :id="id"></div>
</template>

<script>
import { h } from "@/learn-vue/vdom/h";
import { render } from "@/learn-vue/vdom/render";
import { query, FRAGMENT } from "@/learn-vue/vdom/constant";

export default {
  name: "RenderChildren",
  data() {
    return {
      id: "render-children-container"
    };
  },
  mounted() {
    const container = query(`#${this.id}`);
    const childVnode = h(
      "div",
      {
        class: this.id
      },
      h("div", {
        class: "child"
      })
    );
    const arrayChildVnode = h(
      "div",
      {
        class: this.id
      },
      [
        h("div", {
          class: "child"
        })
      ]
    );
    const arrayChildrenVnode = h(
      "div",
      {
        class: this.id
      },
      [
        h("div", {
          class: "child"
        }),
        h("div", {
          class: "child"
        })
      ]
    );

    render(
      h(FRAGMENT, null, [childVnode, arrayChildVnode, arrayChildrenVnode]),
      container
    );
  }
};
</script>
