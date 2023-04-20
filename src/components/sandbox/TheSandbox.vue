<script setup>
import { onMounted } from "vue";
import { Stage } from "@/composables/Stage";

onMounted(() => {
  let stage = new Stage("container");
  window.addEventListener("resize", () => {
    stage.ref.setAttrs({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  });
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
