<script setup>
import { onMounted, ref } from "vue";
import { Stage } from "@/models/Stage";
import { useUserStore } from "@/stores/useUser";

const project = ref();

onMounted(() => {
  project.value = useUserStore().currentProject;
  let stage = new Stage("canvas");
  window.addEventListener("resize", () => {
    const canvasContainer = document.querySelector(".canvas-container");
    stage.ref.setAttrs({
      width: canvasContainer.offsetWidth,
      height: canvasContainer.offsetHeight,
    });
  });


});
</script>

<template>
  <div class="canvas-container">
    <div id="canvas"></div>
  </div>
</template>

<style>
.canvas-container {
  grid-area: canvas-container;
  background-color: #282828;
}

#canvas:focus {
  outline: none;
}
</style>
