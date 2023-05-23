<script setup>
import NodeItem from "@/components/sandbox/nodes/NodeItem.vue";

defineProps({
  nodes: Array,
});
</script>

<template>
  <div class="node-list">
    <node-item v-for="node in nodes" :key="node.id" :node="node"></node-item>
  </div>
</template>

<style scoped>
.node-list {
  display: flex;
}
</style>
