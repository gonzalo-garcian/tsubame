<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="min-h-screen flex">
    <nav class="w-56 flex-none bg-[#404040] px-2">
      <a href="/" class="flex items-center pl-2.5 mb-5 overflow-y-auto mt-5">
        <img
          src="https://imgur.com/eLDbwo3.png"
          alt="Logo: Curled Pangolin"
          width="50"
          height="50"
          class="inline-block pb-1.5"
        />
        <span
          class="self-center text-xl font-mono font-bold whitespace-nowrap dark:text-white pl-5"
        >Tsubame</span
        >
      </a>
      <ul class="space-y-2 font-medium">
        <li>
          <RouterLink
            to="/dashboard/projects"
            class="flex items-center p-2 text-white rounded-lg"
          >
            <svg
              aria-hidden="true"
              class="w-6 h-6 text-gray-500 transition duration-75"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
            </svg>
            <span class="ml-3">Projects</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <main class="flex-1 min-w-0 overflow-auto px-2">
      <RouterView />
    </main>
  </div>
</template>
