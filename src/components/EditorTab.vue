<template>
    <div ref="rete_container" class="rete-container">
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRete } from '../rete/editor'
const rete_container = ref(null);
const [initEditor] = useRete();

onMounted(() => {
    initEditor(rete_container.value)
})

</script>

<style>
.rete-container {
    width: 100vw !important;
    height: 100vh !important;
}
</style>
