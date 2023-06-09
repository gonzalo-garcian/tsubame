<script setup>
defineProps(["data"]);
</script>

<template>
  <p :class="data.COLOR">{{ data.ERROR_LOG }}</p>
</template>

<style scoped>
.text-red {
  color: indianred;
}
.text-green {
  color: darkseagreen;
}
</style>
