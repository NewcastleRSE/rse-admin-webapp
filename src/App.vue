<template>
  <div class="columns">
   
    <NavBar />
    <div class = "column">
    <router-view></router-view>
    </div>
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
  background: linear-gradient(180deg, #65C392 40%, #5ac8fa 40%);
}
</style>
