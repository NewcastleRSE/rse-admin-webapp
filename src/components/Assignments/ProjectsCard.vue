<template>
  <div class="panel">
    <h3 class="panel-heading">Projects Card</h3>
    <ul>
      <li v-if="projects > 0">
        <p
          v-for="project in getProjects"
          :key="project.name"
          class="panel-block"
        >
          {{ project.name }}
        </p>
      </li>
      <li v-else>else</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ProjectsCard",
  data() {
    return {
      projects: this.getProjects,
    };
  },
  computed: {
    getProjects() {
      // gets updated value from store
      return this.$store.getters["projects/getProjects"];
    },
  },
  watch: {
    getProjects(update) {
      this.projects = update;
      console.log(update);
    },
  },
};
</script>
