<template >
    <input type="number" v-on:input="onChange" name="number" v-model="value" class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1">
</template>

<script setup>
    defineProps({
        // onChange: {
        //     type: Function,
        //     required: true
        // }
        value: {
            type: Number,
            default: 5
        }
    })

    import {ref, computed} from 'vue';
    // const text = computed(() => );
</script>

<!-- <style scoped>

</style> -->