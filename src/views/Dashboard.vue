<template>
  <h1>Dashboard</h1>
  <button class="btn" @click="getMembers">Get Members</button>
  <br />
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
      jwt: localStorage.getItem("jwt") || null,
    };
  },
  methods: {
    getMembers() {
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

    clearLS() {
      localStorage.removeItem("jwt");
    },
  },
};
</script>
