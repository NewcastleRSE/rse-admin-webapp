<template>
  <a href="http://localhost:1337/connect/microsoft">login</a>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
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
