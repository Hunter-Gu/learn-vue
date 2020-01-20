<template>
  <div :id="this.id"></div>
</template>

<script>
import { query } from "@/learn-vue/vdom/constant";
import { h } from "../../../learn-vue/vdom/h";
import { render } from "../../../learn-vue/vdom/render";

export default {
  name: "PatchVNodeData",
  data() {
    return {
      id: "patch-vnode-data-container"
    };
  },
  mounted() {
    const container = query(`#${this.id}`);
    const classAndId = "input";
    const value = "hello world";
    const vnode = h(classAndId, {
      class: classAndId,
      style: {
        color: "red"
      },
      props: {
        value
      },
      attrs: {
        id: classAndId
      }
    });

    render(vnode, container);

    setTimeout(() => {
      const newClassAndIdPrefix = "new-";
      const newVnode = h(classAndId, {
        class: newClassAndIdPrefix + classAndId,
        attrs: {
          id: newClassAndIdPrefix + classAndId
        },
        style: {
          color: "blue"
        },
        props: {
          value: value.toUpperCase()
        }
      });
      render(newVnode, container);
    }, 3000);
  }
};
</script>
