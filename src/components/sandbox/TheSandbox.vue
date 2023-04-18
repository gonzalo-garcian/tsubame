<script setup>
import { onMounted } from "vue";
import topology from "@/stores/topology.json";
import { Stage } from "@/composables/Stage";
import { SelectionRectangle } from "@/composables/SelectionRectangle";

const stage = new Stage();
const selectionRectangle = new SelectionRectangle(stage);

window.addEventListener("resize", () => {
  stage.stage.setAttrs({
    width: window.innerWidth,
    height: window.innerHeight,
  });
});

onMounted(() => {
  stage.stage = stage.reference.value.getStage();
  selectionRectangle.selectionRectangle =
    selectionRectangle.reference.value.getStage();
});
</script>

<template>
  <v-stage
    :ref="stage.reference"
    :config="stage.config"
    @contextmenu="stage.contextMenu($event)"
    @mousedown="
      stage.mouseDown($event);
      selectionRectangle.mouseDown($event);
    "
    @mousemove="selectionRectangle.mouseMove($event)"
    @mouseup="
      stage.mouseUp($event);
      selectionRectangle.mouseUp($event);
    "
    @wheel="stage.zoom($event)"
  >
    <v-layer ref="layer">
      <v-rect v-for="node in topology" :key="node.id" :config="node" />
      <v-rect
        :ref="selectionRectangle.reference"
        :config="selectionRectangle.config"
      />
    </v-layer>
  </v-stage>
</template>

<style>
body {
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style>
