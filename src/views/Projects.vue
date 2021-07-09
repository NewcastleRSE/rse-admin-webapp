<template>
  <ProjectsGantt />

  <p>{{ $store.getters["get/getProjects"] }}</p>
</template>

<script>
import ProjectsGantt from "../components/ProjectsGantt.vue";

export default {
  name: "projects",
  components: { ProjectsGantt },
  data() {
    return {};
  },

  methods: {},
};
</script>
