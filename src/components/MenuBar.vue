<template>
  
  <div class="has-background-primary-dark is-centered is-boxed routes tabs is-centered ">
    <ul v-if="currentRouteName !== 'Login'">
      <li :class="currentRouteName === 'Dashboard' ? 'is-active' : ''">
        <router-link :to="{ name: 'Dashboard' }" tag="button">
          Dashboard</router-link
        >
      </li>
      <li :class="currentRouteName === 'Projects' ? 'is-active' : ''">
        <router-link :to="{ name: 'Projects' }" tag="button"
          >Projects</router-link
        >
      </li>
      <li :class="currentRouteName === 'Assignments' ? 'is-active' : ''">
        <router-link :to="{ name: 'Assignments' }" tag="button"
          >Assignments</router-link
        >
      </li>
      <li :class="currentRouteName === 'User' ? 'is-active' : ''">
        <router-link :to="{ name: 'User' }" tag="button">
           User 
        </router-link>
      </li>
    </ul>
  </div>
 
</template>

<script>
export default {
  name: "navbar",
  data() {
    return {};
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
  },
};
</script>