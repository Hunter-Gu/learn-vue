<template>
  <div>
    <router-link v-for="route in routes" :key="route.path" :to="route.path">
      <div v-if="route.path">{{ route.path }}</div>
    </router-link>
  </div>
</template>

<script>
import routes from "@/routes.js";

export default {
  data() {
    return {
      routes
    };
  }
};
</script>
