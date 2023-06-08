<script setup>
import { supabase } from "@/composables/supabase";
import { ref } from "vue";
import { useUserStore } from "@/stores/useUser";
import router from "@/router";

const props = defineProps({
  id: Number,
  name: String,
});

const session = ref();

const getProject = async () => {
  supabase.auth.getSession().then(async ({ data }) => {
    session.value = data.session;
    try {
      const { user } = session.value;

      let { data, error, status } = await supabase
        .from("projects")
        .select(`id, name, data`)
        .eq("user_id", user.id)
        .eq("id", props.id);

      if (error && status !== 406) throw error;

      if (data) {
        useUserStore().currentProject = data;
        await router.push("/sandbox");
      }
    } catch (e) {
      console.log(e);
    }
  });
};
</script>

<template>
  <div
    @click="getProject()"
    class="border border-purple-400 p-10 text-white cursor-pointer"
  >
    <h1 class="text-white text-xl">{{ name }} {{ id }}</h1>
  </div>
</template>
