<template>
  <div>
    <div class="bg-blueGray-100">
      <admin-navbar />
      <header-stats />
      <div class="px-4 md:px-10 mx-auto w-full -m-24">
        <router-view />
        <footer-admin />
      </div>
    </div>
  </div>
</template>
<script>
import AdminNavbar from "@/components/Navbars/AdminNavbar.vue";
import HeaderStats from "@/components/Headers/HeaderStats.vue";
export default {
  name: "admin-layout",
  components: {
    AdminNavbar,
    HeaderStats
  },
};
</script>