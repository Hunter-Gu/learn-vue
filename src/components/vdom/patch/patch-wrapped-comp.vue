<template>
  <div :id="id"></div>
</template>

<script>
import { h } from "@/learn-vue/vdom/h";
import { render } from "@/learn-vue/vdom/render";
import { query } from "@/learn-vue/platform/web";

export default {
  name: "PatchWrappedComp",
  data() {
    return {
      id: "patch-wrapped-comp-container"
    };
  },
  mounted() {
    const container = query(`#${this.id}`);

    render(h(this.getBeforeComp()), container);

    setTimeout(() => {
      render(h(this.getAfterComp()), container);
    }, 3000);
  },
  methods: {
    getBeforeComp() {
      const self = this;

      return class Comp {
        render() {
          return h(self.getChildBeforeComp());
        }
      };
    },
    getChildBeforeComp() {
      return class ChildComp {
        render() {
          return h("span", {
            class: "before"
          });
        }
      };
    },
    getAfterComp() {
      const self = this;

      return class Comp {
        render() {
          return h(self.getChildAfterComp());
        }
      };
    },
    getChildAfterComp() {
      return class ChildComp {
        render() {
          return h("span", {
            class: "after"
          });
        }
      };
    }
  }
};
</script>
