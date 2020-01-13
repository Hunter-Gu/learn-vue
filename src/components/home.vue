<template>
  <div>
    <router-link v-for="route in routes" :key="route" :to="route">{{
      route
    }}</router-link>
  </div>
</template>

<script>
import { RENDER_HTML_ELEMENT } from "@/routes.js";

export default {
  data() {
    return {
      routes: [RENDER_HTML_ELEMENT]
    };
  }
};
</script>
