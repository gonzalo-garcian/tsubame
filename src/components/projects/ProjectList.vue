<script setup>
import ProjectItem from "@/components/projects/ProjectItem.vue";

defineProps({
  projects: Array,
});
</script>

<template>
  <div>
    <ProjectItem
      v-for="project in projects"
      :key="project.id"
      :name="project.name"
    ></ProjectItem>
  </div>
</template>
