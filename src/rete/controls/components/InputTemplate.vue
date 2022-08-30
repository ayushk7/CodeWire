<script setup>
defineProps({
    type: {
        type: String,
        required: true
    },
    modelValue: {
        type: [String, Number],
        default: ''
    }
})
</script>

<template>
    <input :type="type" :placeholder="placeholder">
</template>

<style scoped>
input {
    @apply border-solid border-2 border-border-dark w-32 h-8 bg-neutral-800 mb-4 text-2xl;
}

textarea:focus,
input:focus,
input[type]:focus {
    @apply outline-4 outline outline-neutral-800;
}
</style>