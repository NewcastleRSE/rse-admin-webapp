<template>
  <div>
    <a
      class="text-blueGray-500 block"
      href="#"
      ref="btnDropdownRef"
      v-on:click="toggleDropdown($event)"
    >
      <div class="items-center flex">
        <div class="flex flex-col pr-3 text-white">
          <span class="font-bold text-right">{{user.displayName}}</span>
          <span>{{user.jobTitle}}</span>
        </div>
        <span
          class="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full"
        >
          <img
            alt="..."
            class="w-full rounded-full align-middle border-none shadow-lg"
            :src="`data:image/png;base64,${user.photo}`"
          />
        </span>
      </div>
    </a>
    <div
      ref="popoverDropdownRef"
      class="bg-white text-base z-50 float-right py-2 list-none text-left rounded shadow-lg min-w-48"
      v-bind:class="{
        hidden: !dropdownPopoverShow,
        block: dropdownPopoverShow,
      }"
    >
      <a
        href="javascript:void(0);"
        v-on:click="exportSAP()"
        class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
      >
        <i class="fa-regular fa-calendar-check"></i> Export SAP Allocations
      </a>
      <a
        href="javascript:void(0);"
        v-on:click="uploadTransactions()"
        class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
      >
       <i class="fa-solid fa-cloud-arrow-up"></i> Upload Account Transactions
      </a>
      <div class="h-0 my-2 border border-solid border-blueGray-100" />
      <a
        href="javascript:void(0);"
        v-on:click="logout()"
        class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
      >
       <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
      </a>
    </div>
  </div>
</template>

<script>
import { createPopper } from "@popperjs/core";
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      dropdownPopoverShow: false
    };
  },
  computed: {
    ...mapGetters('auth', ['user'])
  },
  methods: {
    toggleDropdown: function (event) {
      event.preventDefault();
      if (this.dropdownPopoverShow) {
        this.dropdownPopoverShow = false;
      } else {
        this.dropdownPopoverShow = true;
        createPopper(this.$refs.btnDropdownRef, this.$refs.popoverDropdownRef, {
          placement: "bottom-end",
        });
      }
    },
    exportSAP: function () {
    },
    uploadTransactions: function () {
    },
    logout: function () {
      this.$store.dispatch("auth/logout");
    }
  },
};
</script>
