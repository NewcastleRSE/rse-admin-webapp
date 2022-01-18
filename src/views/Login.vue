<template>
  <div class="container mx-auto px-4 h-full">
    <div class="flex content-center items-center justify-center h-full">
      <div class="w-full lg:w-4/12 px-4">
        <div
          class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0"
        >
          <div class="rounded-t mb-0 px-6 py-6">
            <div class="text-center mb-3">
              <h1 class="text-blueGray-500 font-bold">
                RSE Admin
              </h1>
            </div>
            <hr class="mt-6 border-b-1 border-blueGray-300" />
          </div>
          <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
              <div class="text-center mt-6">
                <a
                  class="flex bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                  type="button"
                  v-bind:href=" apiUrl + '/connect/microsoft'"
                >
                <img alt="Newcastle University Logo" class="h-10 m-auto" :src="nclLogoWhite" />
                </a>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import nclLogoWhite from "@/assets/img/ncl-logo-white.png";

export default {
  name: "login",
  data() {
    return {
      nclLogoWhite,
      apiUrl: process.env.VUE_APP_API_URL,
      accessToken: null
    };
  },
  created() {
    let url = window.location;
    let accessToken = new URLSearchParams(url.search).get("access_token");

    if (accessToken) {
      this.$store.dispatch("auth/login", accessToken);
    }
  }
};
</script>
