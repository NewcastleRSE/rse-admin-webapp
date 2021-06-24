<template>
  <h1>Dashboard</h1>
  <button class="btn" @click="getMembers">Get Members</button>
  <br />
  <a href="http://localhost:1337/connect/microsoft">login</a>
  <p>{{ members }}</p>
  <p>{{ token }}</p>
</template>

<script>
import axios from "axios";

export default {
  name: "dashboard",
  data() {
    return {
      token: "No Token",
      members: "No memebers",
    };
  },
  created() {
    let url = window.location;
    this.token = new URLSearchParams(url.search).get("access_token");
    console.log(this.token);
  },
  methods: {
    async getMembers() {
      console.log("click");
      const token = this.token;

      axios
        .get("http://localhost:1337/members", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
