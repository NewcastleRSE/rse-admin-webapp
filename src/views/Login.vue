<template>
  <a href="http://localhost:1337/connect/microsoft">login</a>
</template>

<script>
import axios from "axios";
import router from "../router/index";

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
      this.login(accessToken);
    }
  },
  methods: {
    login(accessToken) {
      const url =
        "http://localhost:1337/auth/microsoft/callback/?access_token=" +
        accessToken;
      axios
        .get(url)
        .then((res) => {
          //this.jwt = res.data.jwt;
          //this.$store.commit("setAuth", true);
          localStorage.setItem("jwt", res.data.jwt);
          console.log(res.data.jwt);
          router.push({ name: "Dashboard" });
          // this.$router.replace({name: "Dashboard"})
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
