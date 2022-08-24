<script setup>
import projects from "../assets/js/projects.js";
import AddProject from "./parts/AddTemplate.vue";
import FormTemplate from "./parts/FormTemplate.vue";
import InputTemplate from "./parts/InputTemplate.vue";

projects.projectArr = [];
</script>
<template>
  <AddProject msg="Add Project" />
  <div class="box flex place-content-center">
    <div class="box-dark w-full">
      <!--      <FormTemplate id="add-project" action="/" method="POST">-->
      <form id="add-project" action="/" class="" method="POST">
        <InputTemplate msg="Project Title" name="project_title" type="text" />
        <InputTemplate
          msg="Project Description"
          name="description"
          type="text"
        />
        <!--      </FormTemplate>-->
      </form>
      <div class="w-full flex justify-end">
        <button
          class="bg-primary p-2 rounded text-border-dark font-title text-2xl outline outline-4 outline-border-dark"
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