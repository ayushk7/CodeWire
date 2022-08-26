<template>
    <div ref="editor_container" class="rete-container" style="width: 100%; height: 500px">
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRete } from '../rete/editor'

defineProps({
  width: {
    type: String,
    required: true
  },
  height: {
    type: String,
    required: true
  }
})


const editor_container = ref(null);
const [initEditor] = useRete();

onMounted(() => {
    initEditor(editor_container.value)
})

</script>

<style scoped>

</style>
