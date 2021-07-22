<template>
    
    <aside class="menu column p-5 is-2 ">
    <p class="menu-label ">
      General
    </p>
    <ul class="menu-list">
      <li :class="currentRouteName === 'Dashboard' ? 'is-active' : ''">
        <router-link :to="{ name: 'Dashboard' }" tag="button">
          <font-awesome-icon icon="tachometer-alt"  /> Dashboard
        </router-link
        >
      </li>
      <li :class="currentRouteName === 'Projects' ? 'is-active' : ''">
        <router-link :to="{ name: 'Projects' }" tag="button">
          <font-awesome-icon icon="project-diagram"/>
          Projects
        </router-link>
      </li>
    </ul>
    <p class="menu-label">
      Administration
    </p>
    <ul class="menu-list">
      <li :class="currentRouteName === 'Assignmets' ? 'is-active' : ''">
        <router-link :to="{ name: 'Assignments' }" tag="button">
          <font-awesome-icon icon="tasks"/>
          Assignments
        </router-link>
      </li>
      <li :class="currentRouteName === 'Max' ? 'is-active' : ''">
        <router-link :to="{ name: 'Max' }" tag="button">
          <font-awesome-icon icon="tasks"/>
          Max
        </router-link>
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
