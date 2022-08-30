<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import projects from "../assets/js/projects.js";
import AddProject from "./parts/AddTemplate.vue";
import FormTemplate from "./parts/FormTemplate.vue";
import InputTemplate from "./parts/InputTemplate.vue";

projects.projectArr = [];

const router = useRouter();

function onSubmitProject() {
  console.log(project_title.value, project_description.value)
  // code to the post request

  // to redirect we can use
  router.push('/editor')


}

const project_title = ref('hi');
const project_description = ref('sup')

</script>
<template>
  <AddProject msg="Add Project" />
  <div class="box flex place-content-center">
    <div class="box-dark w-full">
      <!--      <FormTemplate id="add-project" action="/" method="POST">-->
      <div>
        <InputTemplate label="Project Title" name="project_title" type="text" v-model="project_title" />
        <InputTemplate label="Project Description" name="description" type="text" v-model="project_description" />
        <!--      </FormTemplate>-->
      </div>
      <div class="w-full flex justify-end">
        <button @click="onSubmitProject"
          class="bg-primary p-2 rounded text-border-dark font-title text-2xl outline outline-4 outline-border-dark"
          type="submit" value="Submit">
          Submit
        </button>
      </div>
    </div>
  </div>
</template>
