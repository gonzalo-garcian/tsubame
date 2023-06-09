<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <nav class="container flex items-center py-4 mt-4 sm:mt-12">
      <RouterLink to="/" class="py-1 text-2xl font-mono text-white">
        <img
          src="https://imgur.com/eLDbwo3.png"
          alt="Logo: Curled Pangolin"
          width="50"
          height="50"
          class="inline-block pb-1.5"
        />
        Tsubame
      </RouterLink>
      <ul
        class="hidden sm:flex flex-1 justify-end items-center gap-12 text-bookmark-blue text-[15px] font-mono text-white"
      >
        <li class="cursor-pointer hover:text-purple-500">
          <RouterLink to="/about">Docs</RouterLink>
        </li>
        <li class="cursor-pointer hover:text-purple-500">
          <RouterLink to="/about">Blog</RouterLink>
        </li>

        <li class="cursor-pointer hover:text-purple-500">
          <div
            class="bg-purple-500 drop-shadow-personalize-down rounded-full px-3 py-1.5 drop-shadow-personalize-up text-white"
          >
            <RouterLink to="/sandbox">Sandbox</RouterLink>
          </div>
        </li>
        <li class="border-l-2 border-gray-50 pl-10 cursor-pointer hover:text-purple-500">
          <RouterLink to="/login">Log In</RouterLink>
        </li>
        <li class="cursor-pointer hover:text-purple-500">
          <RouterLink to="/signup">Sign up</RouterLink>
        </li>
        <li class="cursor-pointer fill-teal-50">
          <a href="https://github.com/gonzalo-garcian/tsubame">
            <img
              src="@/assets/github-mark.svg"
              alt="Logo: GitHub"
              width="20"
              height="20"
              class="inline-block"
            />
          </a>
        </li>
      </ul>

      <!--<RouterLink to="/login">Sign in</RouterLink>
      <RouterLink to="/signup">Sign up</RouterLink> -->
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
.drop-shadow-personalize-up {
  filter: drop-shadow(8px 7px 4px #4444dd);
}

.drop-shadow-personalize-down:hover {
  filter: drop-shadow(4px 5px 4px #4444dd);
}
</style>
