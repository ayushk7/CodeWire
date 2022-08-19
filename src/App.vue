<script setup>
import { RouterLink, RouterView, useRouter } from "vue-router";
// eslint-disable-next-line no-unused-vars
import { computed } from "vue";
import DashboardIcon from "./components/icons/IconDashboard.vue";
import DocumentationIcon from "./components/icons/IconDocumentation.vue";
import SupportIcon from "./components/icons/IconSupport.vue";

//import HelloWorld from './components/HelloWorld.vue'
const router = useRouter();
const isDashboard = computed(() => router.currentRoute.value.path !== "/");
const isDocumentation = computed(
  () => router.currentRoute.value.path !== "/documentation"
);
</script>

<template>
  <div class="grid grid-cols-8">
    <!-- main grid -->
    <header class="col-span-full flex items-center mb-20">
      <img
        alt="Code Wire"
        class="w-7 h-7"
        src="src/assets/img/Code Wire Logo.svg"
      />

      <nav class="font-title text-2xl ml-4">
        <ul class="flex">
          <li v-if="isDashboard">
            <RouterLink class="flex items-center" to="/">
              <DashboardIcon class="mr-2" />
              Dashboard
            </RouterLink>
          </li>
          <li v-if="isDocumentation">
            <RouterLink class="flex items-center" to="/documentation">
              <DocumentationIcon class="mr-2" />
              Documentation
            </RouterLink>
          </li>
          <li>
            <RouterLink class="flex items-center" to="/support">
              <SupportIcon class="mr-2" />
              Support
            </RouterLink>
          </li>
          <li></li>
          <li></li>
        </ul>
      </nav>

      <!--     <HelloWorld msg="You did it!" />-->
    </header>

    <RouterView />

    <footer class=""></footer>
  </div>
  <!-- main grid end -->
</template>

<style scoped></style>
