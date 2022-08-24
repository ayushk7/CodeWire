<script setup>
// TODO:Figure how to get this form component to work
defineProps({
  id: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
});
</script>
<template>
  <form :id="id" :action="action" :method="method"></form>
</template>
