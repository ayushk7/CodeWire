<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});
</script>
<template>
  <h2>
    <label :for="name">{{ msg }}</label>
  </h2>
  <input :name="name" :type="type" />
</template>
