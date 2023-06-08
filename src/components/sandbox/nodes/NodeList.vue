<script setup>
import NodeItem from "@/components/sandbox/nodes/NodeItem.vue";

defineProps({
  nodes: Array,
  name: String,
});
</script>

<template>
  <h1 class="text-white text-xl text-center font-mono font-bold border-b border-purple-400 p-2">{{ name }}</h1>
  <div class="flex flex-wrap text-white text-lg text-center font-mono font-bold p-2">
    <node-item v-for="node in nodes" :key="node.id" :node="node"></node-item>
  </div>
</template>

<style scoped>
.node-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
</style>
