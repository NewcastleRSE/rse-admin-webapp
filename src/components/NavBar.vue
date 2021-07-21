<template>
    
    <aside class="menu column is-2 has-background-white">
    <p class="menu-label ">
      General
    </p>
    <ul class="menu-list">
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
    </ul>
    <p class="menu-label">
      Administration
    </p>
    <ul class="menu-list">
      <li :class="currentRouteName === 'Assignmets' ? 'is-active' : ''">
        <router-link :to="{ name: 'Assignments' }" tag="button"
          >Assignments</router-link
        >
      </li>
      <li :class="currentRouteName === 'Max' ? 'is-active' : ''">
        <router-link :to="{ name: 'Max' }" tag="button">Max</router-link>
      </li>
    </ul>
  </aside>
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
