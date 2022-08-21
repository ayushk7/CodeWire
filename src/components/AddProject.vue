<script setup>
import projects from "../assets/js/projects.js";
import AddProject from "./parts/Add.vue";

projects.projectArr = [];
</script>
<template>
  <AddProject msg="Add Project" />
  <div class="box flex place-content-center">
    <div class="box-dark w-full">
      <form id="add-project" action="/" class="" method="POST">
        <h2><label for="title">Project Title</label></h2>
        <input name="title" type="text" />
        <h2><label for="title">Description</label></h2>
        <input name="title" type="text" />
      </form>
      <div class="w-full flex justify-end">
        <button
          class="bg-primary p-2 rounded text-border-dark font-title text-2xl outline outline-4 outline-border-dark text-shadow"
          form="add-project"
          type="submit"
          value="Submit"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>
