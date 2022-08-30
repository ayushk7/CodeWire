<script setup>
defineProps({
  label: {
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
  modelValue: {
    type: [String, Number],
    default: ''
  }
});

</script>
<template>
  <h2>
    <label :for="name">{{ label }}</label>
  </h2>
  <input :name="name" :type="type" :placeholder="label" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"/>
</template>
