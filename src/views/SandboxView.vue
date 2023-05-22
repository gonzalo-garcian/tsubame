<script setup>
import TheSandbox from "@/components/sandbox/TheSandbox.vue";
import TheComponents from "@/components/sandbox/nodes/TheNodes.vue";
import TheTerminal from "@/components/sandbox/terminal/TerminalItem.vue";
</script>

<template>
  <div class="grid-container">
    <div class="sidebar"></div>
    <TheComponents />
    <TheSandbox />
    <TheTerminal />
  </div>
</template>

<style>
.grid-container {
  display: grid;
  grid-template-columns: 2vw 15vw 83vw;
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
</style>
