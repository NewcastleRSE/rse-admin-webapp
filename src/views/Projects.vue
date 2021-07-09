<template>
  <br />
  <h1>Projects</h1>
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
  border: 3px solid green;
}
</style>
