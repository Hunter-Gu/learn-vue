<template>
  <div :id="id"></div>
</template>

<script>
import { h } from "@/learn-vue/vdom/h";
import { render } from "@/learn-vue/vdom/render";
import { query } from "@/learn-vue/vdom/constant";

export default {
  name: "RenderComp",
  data() {
    return {
      id: "render-comp-container"
    };
  },
  mounted() {
    const container = query(`#${this.id}`);

    render(this.getNormalCompVnode(), container);
    render(this.getFunctionalCompVnode(), container);
  },
  methods: {
    getNormalCompVnode() {
      class ClassComp {
        render() {
          return h("span");
        }
      }

      return h(ClassComp);
    },
    getFunctionalCompVnode() {
      const FuncitonalComp = () => h("p");
      FuncitonalComp.functional = true;
      return h(FuncitonalComp);
    }
  }
};
</script>
