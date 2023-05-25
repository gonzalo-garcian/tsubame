<script setup>
import { useTopologyStore } from "@/stores/useTopology";

defineProps({
  node: Object,
});

let topology = useTopologyStore();

const startDrag = (e, nodeType) => {
  //e.preventDefault();
  topology.dropedNodeType = nodeType;
  console.log(topology.dropedNodeType);
};
</script>

<template>
  <div class="node-item" draggable @dragstart="startDrag($event, node.name)">
    <img :src="node.img" :alt="node.alt" />
    <h1>{{ node.name }}</h1>
  </div>
</template>

<style scoped>
.node-item {
  width: 100px;
  height: 110px;
  margin: 10px auto;
  background-color: #404040;
  color: white;
  font-family: monospace;
  font-size: 14px;
  padding: 20px 20px 20px 20px;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 4px 8px 0 rgba(147, 112, 219, 0.1);
  transition: 0.3s;
  user-select: none;
}

.node-item:hover {
  box-shadow: 0 8px 16px 0 rgba(147, 112, 219, 0.5);
  cursor: grab;
}
</style>
