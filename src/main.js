import Vue from "vue";
import VueRouter from "vue-router";
import App from "@/components/App.vue";
import routes from "./routes";

Vue.use(VueRouter);

new Vue({
  el: "#app",
  router: new VueRouter({ routes, mode: "history" }),
  render: h => h(App)
});
