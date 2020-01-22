<template>
  <div :id="id"></div>
</template>

<script>
import { query } from "@/learn-vue/vdom/constant";
import { h } from "../../../learn-vue/vdom/h";
import { render } from "../../../learn-vue/vdom/render";

export default {
  name: "PatchFunctionalComp",
  data() {
    return {
      id: "patch-functional-comp-container"
    };
  },
  mounted() {
    const container = query(`#${this.id}`);
    const FunctionalComp = props => h("span", { class: props.classname });
    FunctionalComp.functional = true;

    render(
      h(FunctionalComp, {
        props: {
          classname: "before"
        }
      }),
      container
    );

    setTimeout(() => {
      render(
        h(FunctionalComp, {
          props: {
            classname: "after"
          }
        }),
        container
      );
    }, 3000);
  }
};
</script>
