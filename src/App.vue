<script setup>
import { computed } from "vue";
import { watchEffect } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
//import HelloWorld from './components/HelloWorld.vue'
const router = useRouter();
const isDashboard = computed(() => router.currentRoute.value.path !== "/");
watchEffect(() => {
  console.log(isDashboard.value.path);
})

</script>

<template>
<li><RouterLink to="/editor">Editor</RouterLink></li>
<RouterView />
</template>