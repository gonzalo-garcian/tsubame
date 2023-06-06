<script setup>
import NodeItem from "@/components/sandbox/nodes/NodeItem.vue";

defineProps({
  nodes: Array,
  name: String,
});
</script>

<template>
  <h1 class="title">{{ name }}</h1>
  <div class="node-list">
    <node-item v-for="node in nodes" :key="node.id" :node="node"></node-item>
  </div>
</template>

<style scoped>
.node-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.title {
  color: white;
  margin-bottom: 10px;
  font-family: monospace;
  font-size: 16px;
}
</style>
