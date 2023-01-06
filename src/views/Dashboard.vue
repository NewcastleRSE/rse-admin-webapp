<template>
  <div>
    <availability-stats />
    <div class="px-4 md:px-10 mx-auto w-full -m-24">
      <div class="flex flex-wrap">
        <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <card-projects-overview />
        </div>
        <div class="w-full xl:w-4/12 px-4">
          <card-cost-recovery-overview />
        </div>
      </div>
      <div class="flex flex-wrap mt-4">
        <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <card-projects-status />
        </div>
        <div class="w-full xl:w-4/12 px-4">
          <card-time-split />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CardCostRecoveryOverview from "@/components/Cards/CardCostRecoveryOverview.vue"
import CardProjectsOverview from "@/components/Cards/CardProjectsOverview.vue"
import CardProjectsStatus from "@/components/Cards/CardProjectsStatus.vue"
import CardTimeSplit from "@/components/Cards/CardTimeSplitOverview.vue"
import AvailabilityStats from "@/components/Headers/AvailabilityStats.vue"
export default {
  name: "dashboard-page",
  components: {
    CardCostRecoveryOverview,
    CardProjectsOverview,
    CardProjectsStatus,
    CardTimeSplit,
    AvailabilityStats
  },
}
</script>
