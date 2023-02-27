<script setup>
import ProjectList from "@/components/projects/ProjectList.vue";
import projects from "@/stores/projects.json";
</script>

<template>
  <ProjectList :projects="projects"></ProjectList>
</template>
