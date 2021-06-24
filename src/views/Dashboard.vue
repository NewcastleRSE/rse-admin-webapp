<template>
  <h1>Dashboard</h1>
  <button class="btn" @click="getMembers">Get Members</button>
  <br />
  <a href="http://localhost:1337/connect/microsoft">login</a>
  <p>{{ members }}</p>
</template>

<script>
import axios from "axios";

export default {
  name: "dashboard",
  data() {
    return {
      token: "No Token",
      members: "No memebers",
      jwt: "",
    };
  },
  created() {
    let url = window.location;
    this.token = new URLSearchParams(url.search).get("access_token");
    console.log(this.token);
    if (this.token) {
      this.getToken();
    }
  },
  methods: {
    getToken() {
      const url =
        "http://localhost:1337/auth/microsoft/callback/?access_token=" +
        this.token;
      axios
        .get(url)
        .then((res) => {
          this.jwt = res.data.jwt;
          console.log(this.jwt);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getMembers() {
      console.log("click");

      axios
        .get("http://localhost:1337/members", {
          headers: {
            Authorization: `Bearer ${this.jwt}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          this.members = response.data;
        })
        .catch((error) => {
          console.log(error);
          this.members = error;
        });
    },
  },
};
</script>
