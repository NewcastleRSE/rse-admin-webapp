<template>
  <div>
    <div class="bg-blueGray-100">
      <admin-navbar />
      <router-view />
    </div>
  </div>
</template>
<script>
import AdminNavbar from "@/components/Navbars/AdminNavbar.vue"
export default {
  name: "admin-layout",
  components: {
    AdminNavbar
  },
};
</script>
