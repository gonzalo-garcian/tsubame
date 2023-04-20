<script setup>
import { onMounted } from "vue";
import { Stage } from "@/composables/Stage";

onMounted(() => {
  new Stage("container");
});
</script>

<template>
  <div id="container"></div>
</template>

<style>
body {
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style>
