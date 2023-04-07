<script setup>
import { ref, onMounted } from "vue";
import topology from "@/stores/topology.json";

const width = window.innerWidth;
const height = window.innerHeight;

const stageReference = ref();
const stageConfig = {
  width: width,
  height: height,
};

const selectionRectangleReference = ref();
const selectionRectangleConfig = {
  fill: "rgba(0,0,255,0.5)",
  visible: false,
};

onMounted(() => {
  const stage = stageReference.value.getStage();
  const selectionRectangle = selectionRectangleReference.value.getStage();

  window.addEventListener("resize", () => {
    stageReference.value.getStage().setAttrs({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  });

  stage.on("contextmenu", (e) => {
    e.evt.preventDefault();
  });

  stage.on("mousedown", (e) => {
    if (e.evt.button === 2 && e.target === stage) {
      stage.startDrag();
    }
  });

  stage.on("mouseup", (e) => {
    if (e.evt.button === 2 && e.target === stage) {
      stage.stopDrag();
    }
  });

  let x1, y1, x2, y2;
  stage.on("mousedown touchstart", (e) => {
    // do nothing if we mousedown on any shape
    if (e.target !== stage) {
      return;
    }
    e.evt.preventDefault();
    x1 = stage.getRelativePointerPosition().x;
    y1 = stage.getRelativePointerPosition().y;
    x2 = stage.getRelativePointerPosition().x;
    y2 = stage.getRelativePointerPosition().y;

    selectionRectangle.visible(true);
    selectionRectangle.width(0);
    selectionRectangle.height(0);
  });

  stage.on("mousemove touchmove", (e) => {
    // do nothing if we didn't start selection
    if (!selectionRectangle.visible()) {
      return;
    }
    e.evt.preventDefault();
    x2 = stage.getRelativePointerPosition().x;
    y2 = stage.getRelativePointerPosition().y;

    selectionRectangle.setAttrs({
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    });
  });

  stage.on("mouseup touchend", (e) => {
    // do nothing if we didn't start selection
    if (!selectionRectangle.visible()) {
      return;
    }
    e.evt.preventDefault();
    // update visibility in timeout, so we can check it in click event
    setTimeout(() => {
      selectionRectangle.visible(false);
    });
  });
});
</script>

<template>
  <v-stage ref="stageReference" :config="stageConfig">
    <v-layer ref="layer">
      <v-rect v-for="node in topology" :key="node.id" :config="node" />
      <v-rect
        ref="selectionRectangleReference"
        :config="selectionRectangleConfig"
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
