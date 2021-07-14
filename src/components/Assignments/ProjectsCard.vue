<template>
  <div class="panel">
    <h3 class="panel-heading">Projects Card</h3>
    <ul>
      <li v-if="projects">
        <p v-for="project in projects" v-bind:key="project">{{project.name}}</p>
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
      projects: null,
      members: [],
    };
  },

  created() {
    this.projects = this.getProjects;
  },

  computed: {
    getProjects() {
      // gets updated value from store
      return this.$store.getters["get/getProjects"];
    },
  },
  watch: {
    getProjects(update) {
      // watches 'getProjects()' to update data in chart
      this.projects = update;
    },
  },
};
</script>
