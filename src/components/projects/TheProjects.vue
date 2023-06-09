<script setup>
import ProjectList from "@/components/projects/ProjectList.vue";
import { supabase } from "@/composables/supabase";
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/useUser";
const session = ref();
const projects = ref();

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session;
    useUserStore().id = session.value.user.id;
    getProjects();
  });

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session;
  });
});

async function getProjects() {
  try {
    const { user } = session.value;

    let { data, error, status } = await supabase
      .from("projects")
      .select(`id, name`)
      .eq("user_id", user.id);

    if (error && status !== 406) throw error;

    if (data) {
      projects.value = data;
    }
  } catch (error) {
    console.log(error);
  }
}
</script>

<template>
  <div class="flex flex-row flex-wrap gap-10 mx-10 mt-10">
    <div
      class="text-xl border border-purple-400 p-10 border-dashed text-white cursor-pointer"
    >
      New project
    </div>
    <ProjectList :projects="projects"></ProjectList>
  </div>
</template>
