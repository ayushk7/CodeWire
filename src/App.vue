<script setup>
import { RouterLink, RouterView,  useRouter } from "vue-router";
// eslint-disable-next-line no-unused-vars
import {computed} from "vue";
import DashboardIcon from './components/icons/IconDashboard.vue';
import DocumentationIcon from './components/icons/IconDocumentation.vue';

//import HelloWorld from './components/HelloWorld.vue'
const router= useRouter();
const isDashboard = computed(() => router.currentRoute.value.path !== "/")

</script>

<template>
<div class="grid grid-cols-8 "><!-- main grid -->
  <header class="col-span-full flex items-center mb-20">
    <img alt="Code Wire" class="w-7 h-7" src="src/assets/img/Code Wire Logo.svg" />

    <nav class="font-title text-2xl ml-4">
      <ul class="flex">
        <li v-if="isDashboard"><DashboardIcon class="mr-2" /><RouterLink to="/">Dashboard</RouterLink></li>
        <li><DocumentationIcon class="mr-2" /><RouterLink to="/about">Documentation</RouterLink></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </nav>


<!--     <HelloWorld msg="You did it!" />-->


  </header>

  <RouterView />

  <footer class="">

  </footer>
</div><!-- main grid end -->
</template>

<style scoped>

</style>
