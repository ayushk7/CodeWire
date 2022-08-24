<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
});
import AddIcon from "../icons/IconAdd.vue";
</script>
<template>
  <div class="flex items-baseline mb-12">
    <AddIcon class="w-8 h-8 mr-2 text-primary" />
    <h1>{{ msg }}</h1>
  </div>
</template>
