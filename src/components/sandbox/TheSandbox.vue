<script setup>
import { ref, onMounted } from "vue";

const stage = ref();

onMounted(() => {
  stage.value.getStage().container().style.backgroundColor = "purple";
});

const width = window.innerWidth;
const height = window.innerHeight;

const rectangles = [
  {
    rotation: 0,
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    scaleX: 1,
    scaleY: 1,
    fill: "red",
    name: "rect1",
    draggable: true,
  },
  {
    rotation: 0,
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    scaleX: 1,
    scaleY: 1,
    fill: "green",
    name: "rect2",
    draggable: true,
  },
];

const configKonva = {
  width: width,
  height: height,
  draggable: true,
};
</script>

<template>
  <v-stage ref="stage" :config="configKonva">
    <v-layer ref="layer">
      <v-rect v-for="item in rectangles" :key="item.id" :config="item" />
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
