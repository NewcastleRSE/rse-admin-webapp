<template>
  <div>
    <availability-stats />
    <div class="px-4 md:px-10 mx-auto w-full -m-24">
      <div class="flex flex-wrap">
        <div class="w-full lg:w-4/12 px-4">
          <CardProfile />
        </div>
        <div class="w-full lg:w-8/12 px-4">
          <CardSettings />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CardSettings from "@/components/Cards/CardSettings.vue"
import CardProfile from "@/components/Cards/CardProfile.vue"
import AvailabilityStats from "@/components/Header/AvailabilityStats.vue"

export default {
  components: {
    CardSettings,
    CardProfile,
    AvailabilityStats
  },
};
</script>
