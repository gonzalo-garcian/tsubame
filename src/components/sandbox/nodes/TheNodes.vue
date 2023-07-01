<script setup>
import NodeList from "@/components/sandbox/nodes/NodeList.vue";
import nodes from "@/stores/nodes.json";
</script>

<template>
  <div class="node-menu border border-purple-400">
    <node-list :nodes="nodes" name="Network nodes"></node-list>
  </div>
</template>

<style>
.node-menu {
  padding: 20px;
  grid-area: node-menu;
  background-color: #181818;
  //padding: 20px;
}
</style>
