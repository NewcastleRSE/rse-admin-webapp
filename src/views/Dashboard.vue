<template>
  <h1>Dashboard</h1>
  <button class="btn" @click="getMembers">Get Members</button>
  <button @click="clearLS">Remove local storage</button>
  <br />
  <a href="http://localhost:1337/connect/microsoft">login</a>
  <p>{{ members }}</p>
</template>

<script>
import axios from "axios";

export default {
  name: "dashboard",
  data() {
    console.log(jwt);
    return {
      token: "No Token",
      members: "No memebers",
      jwt: localStorage.getItem("jwt") || null,
    };
  },
  methods: {
    getMembers() {
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
