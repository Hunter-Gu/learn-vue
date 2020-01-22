<template>
  <div :id="id"></div>
</template>

<script>
import { h } from "@/learn-vue/vdom/h";
import { render } from "@/learn-vue/vdom/render";
import { query } from "@/learn-vue/vdom/constant";

export default {
  name: "RenderWrappedComp",
  data() {
    return {
      id: "render-wrapped-comp-container"
    };
  },
  mounted() {
    const container = query(`#${this.id}`);

    render(h(this.getComp()), container);
  },
  methods: {
    getComp() {
      const self = this;

      return class Comp {
        render() {
          return h(self.getChildComp());
        }
      };
    },
    getChildComp() {
      return class ChildComp {
        render() {
          return h("span");
        }
      };
    }
  }
};
</script>
