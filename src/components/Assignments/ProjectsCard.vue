<template>
  <div class="panel has-background-primary-light">
    <h3 class="panel-heading has-background-primary-light">Projects Card</h3>
    <p class="panel-tabs">
      <a :class="currentTab == null ? 'is-active' : ''" @click="filter()">All</a>
      <a :class="currentTab == 'Funded Awaiting Allocation' ? 'is-active' : ''" @click="filter('Funded Awaiting Allocation')">Unallocated</a>
      <a :class="currentTab == 'Allocated' ? 'is-active' : ''" @click="filter('Allocated')">Allocated</a>
    </p>
    <ul>
      <li style="height: 70vh; overflow: scroll" v-if="filterProjects">
        <p
          v-for="project in filterProjects"
          v-bind:key="project"
          @click="toggleModal(project)"
          class="box m-2"
          style="font-size: 0.8em"
        >
          <a class="has-text-link">{{ project.name }}</a>
          <br />
          <small v-if="project.amount">
            <span style="font-weight: bold;"> Amount: </span>
              {{ project.amount }}
            </small>
          <small v-else>
            <span style="font-weight: bold;"> Amount: </span>
              N/A
          </small>
          <br />
          <small v-if="project.amount"
            ><span style="font-weight: bold;"> Faculty: </span
            >{{ project.faculty }}</small
          >
          <small v-else>
            <span style="font-weight: bold;"> Faculty: </span>
              N/A
          </small>
        </p>
      </li>
      <li v-else>else</li>
    </ul>
  </div>
</template>
<script>
import { format } from 'money-formatter';

export default {
  name: "ProjectsCard",
  data() {
    return {
      currentTab: null,
      projects: null,
      members: [],
      filterProjects: null, // select allocated
    };
  },
  methods: {
    toggleModal(project) {
      this.$emit("toggleFormModal", project);
    },
    filter(name = null) {
      // change to ES6 filter
      this.currentTab = name;
      this.filterProjects = [];
      let projects = this.projects;
      if (name) {
        for (let idx in projects) {
          let project = projects[idx];
          if (project.stage === name) {
            project.amount = format('GBP', project.amount)
            this.filterProjects.push(project);
          }
        }
      } else {
        this.filterProjects = projects;
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
      let prjs = this.$store.getters["projects/getProjects"]; // even when projects is identical to get, dont work
      prjs.forEach((prj) => {
        prj.amount = format('GBP', prj.amount)
      })
      return prjs;
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
