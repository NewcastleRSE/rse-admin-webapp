<template>
  
  <MenuBar />
  <div class="columns">
    <div class = "container column is-9">
    <router-view></router-view>
    </div>
  </div>
</template>

<script>
import MenuBar from "./components/MenuBar.vue";
export default {
  name: "App",
  components: { MenuBar },
  created() {
    console.log(this.$route.path)
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
  background: white;
}


</style>
