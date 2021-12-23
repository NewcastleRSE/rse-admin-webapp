<template>
  <div style="height: 100vh;">
  <div class = "card has-background-primary-dark">
  <h1 class="is-size-1 has-text-centered has-text-weight-bold has-text-white" > Welcome back! 
    <span> <br> <a class="button is-primary is-light" v-bind:href=" apiUrl + '/connect/microsoft'"> Login here </a></span>
  </h1>
  </div>
  <br>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      apiUrl: process.env.VUE_APP_API_URL
      //accessToken: null, // maybe make string
    };
  },
  created() {
    let url = window.location;
    let accessToken = new URLSearchParams(url.search).get("access_token");

    if (accessToken) {
      this.$store.dispatch("auth/login", accessToken);
    }
  },
  methods: {},
};
</script>

<style>
body {
  background: rgb(0, 148, 126);
}
</style>
