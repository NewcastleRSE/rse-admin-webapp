<template>
  <h1>Dashboard</h1>
  <div class="container">
    <h2>Members</h2>
    <p>{{ $store.state.getters.members }}</p>
  </div>
  <div class="container">
    <h2>Assignments</h2>
    <p>{{ $store.state.getters.assignments }}</p>
  </div>
  <div class="container">
    <h2>Projects</h2>
    <p>{{ $store.state.getters.projects }}</p>
  </div>
</template>

<script>
//import axios from "axios";

export default {
  name: "dashboard",
  data() {
    return {};
  },
  created() {
    this.$store.dispatch("getters/getMembers", "1");
    this.$store.dispatch("getters/getAssignments");
    this.$store.dispatch("getters/getProjects");
  },
  methods: {},
};
</script>
