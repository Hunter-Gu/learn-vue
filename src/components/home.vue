<template>
  <div>
    <div v-for="route in routes" :key="route.path" :to="route.path">
      <template v-if="route.children">
        <div>{{ route.path }}</div>
        <router-link
          v-for="item in route.children"
          :key="item.path"
          :to="route.path + item.path"
          style="text-indent: 2em"
        >
          <div v-if="item.path">{{ item.path }}</div>
        </router-link>
      </template>
      <router-link v-else :to="route.path">
        <div v-if="route.path">{{ route.path }}</div>
      </router-link>
    </div>
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
