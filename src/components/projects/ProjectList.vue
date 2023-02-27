<script setup>
import Project from "@/components/projects/Project.vue";

defineProps({
  projects: Array,
});
</script>

<template>
  <div>
    <Project
      v-for="project in projects"
      :key="project.id"
      :name="project.name"
    ></Project>
  </div>
</template>
