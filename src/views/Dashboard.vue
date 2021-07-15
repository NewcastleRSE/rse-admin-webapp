<template>
  <h1>Dashboard</h1>
  <br />
  <div class="container">
    <h2>Members</h2>
    <p>{{ $store.state.members.members }}</p>
  </div>
  <br />
  <div class="container">
    <h2>Assignments</h2>
    <p>{{ $store.state.assignments.assignments }}</p>
  </div>
</template>

<script>
export default {
  name: "dashboard",
  data() {
    return {};
  },
  created() {},

  methods: {},
};
</script>
