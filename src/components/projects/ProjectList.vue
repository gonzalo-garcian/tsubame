<script setup>
import ProjectItem from "@/components/projects/ProjectItem.vue";

defineProps({
  projects: Array,
});
</script>

<template>
  <ProjectItem
    v-for="project in projects"
    :key="project.id"
    :id="project.id"
    :name="project.name"
  ></ProjectItem>
</template>
