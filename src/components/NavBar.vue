<template>
  <div class="routes">
    <router-link :to="{ name: 'Dashboard' }" tag="button"
      >Dashboard</router-link
    >
    <router-link :to="{ name: 'Projects' }" tag="button">Projects</router-link>
    <router-link :to="{ name: 'Assignments' }" tag="button"
      >Assignments</router-link
    >
  </div>
</template>
