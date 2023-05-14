<script setup>
import TheSandbox from "@/components/sandbox/TheSandbox.vue";
import TheComponents from "@/components/sandbox/TheComponents.vue";
import TheTerminal from "@/components/sandbox/TheTerminal.vue";
</script>

<template>
  <div class="grid-container">
    <div class="sidebar"></div>
    <div class="node-menu"></div>
    <the-sandbox />
    <the-terminal terminal-output="" />
  </div>
</template>

<style>
.grid-container {
  display: grid;
  grid-template-columns: 3vw 15vw 82vw;
  grid-template-rows: 1fr auto;
  grid-template-areas:
    "sidebar node-menu canvas-container"
    "sidebar terminal  terminal";
  height: 100vh;
}
.sidebar {
  grid-area: sidebar;
  background-color: #141414;
  //padding: 20px;
}

.node-menu {
  grid-area: node-menu;
  background-color: #181818;
  //padding: 20px;
}
</style>
