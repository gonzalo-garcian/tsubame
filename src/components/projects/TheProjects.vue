<script setup>
import ProjectList from "@/components/projects/ProjectList.vue";
import { supabase } from "@/composables/supabase";
import { onMounted, ref } from "vue";
const session = ref();
const projects = ref();

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session;
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
      .select(`id, name, data`)
      .eq("user_id", user.id);

    if (error && status !== 406) throw error;

    if (data) {
      projects.value = data;
      console.log(projects.value);
    }
  } catch (error) {
    alert(error.message);
  }
}
</script>

<template>
  <ProjectList :projects="projects"></ProjectList>
</template>
