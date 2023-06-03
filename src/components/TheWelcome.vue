<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <section class="relative">
    <div
      class="container flex flex-col-reverse lg:flex-row items-center gap-12 mt-14 lg:mt-28"
    >
      <div class="flex flex-1 flex-col items-center">
        <h1
          class="text-bookmark-blue text-6xl px-[200px] text-white font-bold text-center mb-6"
        >
          Rapidly build and test network topologies
          <em class="text-purple-600">without ever leaving your browser.</em>
        </h1>
        <p class="flex text-lg text-center mb-6 text-gray-400 font-mono">
          A clean and safe environment to
          <em class="inline-block text-purple-600">&nbsp;learn&nbsp;</em> the
          basis of networking.
        </p>
        <div class="flex justify-center flex-wrap gap-6 mt-10">
          <RouterLink
            to="/docs"
            class="bg-purple-500 hover:bg-purple-600 font-mono font-bold rounded-lg px-5 py-3 text-white"
            >Get started</RouterLink
          >
        </div>
      </div>
    </div>
  </section>
  <section class="bg-[#303030] py-20 mt-20">
    <div class="mx-auto px-2">
      <h1 class="text-5xl text-center text-white font-bold">
        <em>Features</em>
      </h1>
    </div>
    <div class="relative mt-20">
      <div class="container flex flex-col items-center justify-center gap-x-24">
        <div class="flex flex-1 justify-center z-10 mb-10">
          <img class="w-5/6 h-5/6 inline-block" src="https://imgur.com/LkRcUAM.gif" alt="">
        </div>
        <div class="flex flex-1 flex-col items-center">
          <h1 class="text-3xl text-white font-bold">
            Drag and drop nodes
          </h1>

        </div>
      </div>
    </div>
  </section>
</template>
