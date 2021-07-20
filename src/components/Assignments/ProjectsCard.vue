<template>
  <div class="panel" style="overflow: scroll">
    <h3 class="panel-heading">Projects Card</h3>
    <p class="panel-tabs">
      <a class="is-active" @click="filter()">All</a>
      <a @click="filter('Funded Awaiting Allocation')">Unallocated</a>
      <a @click="filter('Allocated')">Allocated</a>
    </p>
    <ul>
      <li v-if="filterProjects">
        <a
          v-for="project in filterProjects"
          v-bind:key="project"
          @click="toggleModal(project)"
          class="panel-block">
          {{ project.name }}
        </a>
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
      filterProjects: null, // select allocated
    };
  },
  methods: {
    toggleModal(project) {
      this.$emit("toggleModal", project);
    },
    filter(name = null) {
      this.filterProjects = [];
      let projects = this.$store.getters["projects/getProjects"];
      if (name) {
        for (let idx in projects) {
          let project = projects[idx];
          if (project.stage === name) {
            this.filterProjects.push(project);
          }
        }
      } else {
        this.filterProjects = projects
      }
      console.log(this.filterProjects);
      console.log(projects);
    },
  },
  created() {
    let projects = this.getProjects;
    this.projects = projects;
    this.filterProjects = projects;
  },
  computed: {
    getProjects() {
      // gets updated value from store
      return this.$store.getters["get/getProjects"]; // even when projects is identical to get, dont work
    },
  },
  watch: {
    getProjects(update) {
      // watches 'getProjects()' to update data in chart
      this.projects = update;
      this.filterProjects = update;
    },
  },
};
</script>