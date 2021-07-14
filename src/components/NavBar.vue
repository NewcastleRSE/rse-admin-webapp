<template>
  <div class="routes tabs is-centered">
    <ul>
      <li :class="currentRouteName === 'Dashboard' ? 'is-active' : ''">
        <router-link :to="{ name: 'Dashboard' }" tag="button"
          >Dashboard</router-link
        >
      </li>
      <li :class="currentRouteName === 'Projects' ? 'is-active' : ''">
        <router-link :to="{ name: 'Projects' }" tag="button"
          >Projects</router-link
        >
      </li>
      <li :class="currentRouteName === 'Assignmets' ? 'is-active' : ''">
        <router-link :to="{ name: 'Assignments' }" tag="button"
          >Assignments</router-link
        >
      </li>
      <li :class="currentRouteName === 'Max' ? 'is-active' : ''">
        <router-link :to="{ name: 'Max' }" tag="button">Max</router-link>
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
