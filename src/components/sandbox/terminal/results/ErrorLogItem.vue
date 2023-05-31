<script setup>
defineProps(["data"]);
</script>

<template>
  <p>{{ data.ERROR_LOG }}</p>
</template>

<style scoped>
p {
  color: indianred;
}
</style>
