<script setup>
defineProps({
  node: Object,
});
</script>

<template>
  <div class="node-item">
    <img :src="node.img" :alt="node.alt" />
  </div>
</template>

<style scoped>
.node-item {
  width: 100px;
  height: 100px;
  background-color: gray;
  margin-right: 10px;
}
</style>
