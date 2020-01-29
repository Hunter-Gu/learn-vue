<template>
  <div :id="id"></div>
</template>

<script>
import { h } from "@/learn-vue/vdom/h";
import { render } from "@/learn-vue/vdom/render";
import { query } from "@/learn-vue/platform/web";

export default {
  name: "RenderFunctionalComp",
  data() {
    return {
      id: "render-functional-comp-container"
    };
  },
  mounted() {
    const container = query(`#${this.id}`);

    render(this.getFunctionalCompVnode(), container);
  },
  methods: {
    getFunctionalCompVnode() {
      const FuncitonalComp = () => h("p");
      FuncitonalComp.functional = true;
      return h(FuncitonalComp);
    }
  }
};
</script>
