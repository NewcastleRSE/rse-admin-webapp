<template>
  <div class="has-background-primary-light">
    <NavBar />
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";

export default {
  name: "App",
  components: { NavBar },
  created() {
    this.$store.dispatch("get/getProjects");
    this.$store.dispatch("assignments/getAssignments");
    this.$store.dispatch("members/getMembers");
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
