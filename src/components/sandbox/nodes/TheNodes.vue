<script setup>
import NodeList from "@/components/sandbox/nodes/NodeList.vue";
import nodes from "@/stores/nodes.json";
</script>

<template>
  <div class="node-menu">
    <node-list :nodes="nodes"></node-list>
  </div>
</template>

<style>
.node-menu {
  grid-area: node-menu;
  background-color: #181818;
  //padding: 20px;
}
</style>
