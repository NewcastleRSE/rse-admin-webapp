<template>
  <h1>Login</h1>
  <router-link to="/">go to dashboard</router-link>
  <button class="btn" @click="login">CLick here</button>
</template>

<script>
export default {
  name: "login",
  methods: {
    login() {
      console.log("click");
    },
  },
};
</script>
