<template>
  <h1>Dashboard</h1>
  <button class="btn" @click="$store.dispatch('getters/getMembers')">
    Get Members
  </button>
  <br />
  <p>{{ $store.state.auth.jwt }}</p>
  <br />
  <p>{{ $store.state.getters.members }}</p>
</template>

<script>
//import axios from "axios";

export default {
  name: "dashboard",
  data() {
    return {};
  },
  methods: {},
};
</script>
