<script setup>
import { ref } from "vue";
import { supabase } from "@/composables/supabase";
import router from "@/router";

const loading = ref(false);
const email = ref("");
const password = ref("");

const handleLogin = async () => {
  try {
    loading.value = true;
    const { error } = await supabase.auth
      .signInWithPassword({
        email: email.value,
        password: password.value,
      })
      .catch((e) => console.log(e));
    if (error) {
      console.log(error);
    } else {
      await router.push("/dashboard");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="container flex flex-col-reverse items-center gap-12 mt-14 lg:mt-28"
  >
    <div class="flex flex-1 flex-col items-center">
      <h1
        class="text-bookmark-blue text-6xl px-[200px] text-white font-bold text-center mb-20"
      >
        Log In
      </h1>
      <div
        class="w-full rounded-lg shadow border max-w-md p-0 bg-gray-700 border-gray-700 drop-shadow-personalize-up"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <form class="space-y-4 md:space-y-6" @submit.prevent="handleLogin">
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Your email</label
              >
              <input
                v-model="email"
                type="email"
                name="email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required=""
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Password</label
              >
              <input
                v-model="password"
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
              />
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    required=""
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="remember" class="text-gray-500 dark:text-gray-300"
                    >Remember me</label
                  >
                </div>
              </div>
              <a
                href="#"
                class="text-sm font-medium text-white hover:underline dark:text-primary-500"
                >Forgot password?</a
              >
            </div>
            <button
              type="submit"
              class="w-full text-white bg-purple-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Log In
            </button>
            <p class="text-sm font-light text-white">
              Don’t have an account yet?
              <a href="/signup" class="font-medium text-white hover:underline"
                >Sign up</a
              >
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.drop-shadow-personalize-up {
  filter: drop-shadow(8px 7px 4px #4444dd);
}
</style>
