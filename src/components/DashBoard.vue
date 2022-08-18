<script setup>
import AddIcon from "./icons/IconAdd.vue";
import DotsIcon from "./icons/IconDots.vue";
import FileIcon from "./icons/IconFile.vue";
import FolderIcon from "./icons/IconFolder.vue";
import DatabaseIcon from "./icons/IconDatabase.vue";
</script>

<template>
  <h1 class="text-5xl mb-4">Dashboard</h1>
  <div
    class="outline-dashed outline-2 outline-dot-line w-full h-16 p-4 mb-5 rounded-md text-3xl flex place-content-center">
    <add-icon class="self-center text-icon" />
  </div>
  <div class="shadow-md outline outline-2 outline-border bg-box-bg w-full p-4 rounded-md">
    <div class="flex justify-between mb-2 col-span-full row-span-full">
      <h2 class=" text-base">Project Title</h2>
      <div class="text-icon">
        <DotsIcon />
      </div>
    </div>
    <div class="text-xs ">
      Description
    </div>
    <div class="flex justify-between mt-4 col-span-full row-span-full">
      <div class="flex items-center">
        <FolderIcon class="text-icon h-3.5 w-3.5 mr-1.5" />
        <span class="text-xs text-icon mr-2">0/0</span>
        <FileIcon class="text-icon h-3.5 w-3.5 mr-1.5" />
        <span class="text-xs text-icon mr-2">0/0</span>
        <DatabaseIcon class="text-shadow text-icon h-3.5 w-3.5 mr-1.5" />
        <span class="text-xs text-icon">0/0</span>
      </div>
      <div class="text-icon">
        Updated 5 days ago
      </div>
    </div>
  </div>
</template>
