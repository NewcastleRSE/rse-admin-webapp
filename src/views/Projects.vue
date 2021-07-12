<template>
  <ProjectsGantt class="chart" />
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

<style scoped>
.chart {
  width: 75%;
}
</style>
