<template>
  <div>
    <availability-stats />
    <div class="px-4 md:px-10 mx-auto w-full -m-24">
      <div class="w-full mb-12 px-4">
        <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
          <card-projects />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CardProjects from "@/components/Cards/CardProjects.vue"
import AvailabilityStats from "@/components/Headers/AvailabilityStats.vue"

export default {
  name: "projects",
  components: { 
    CardProjects,
    AvailabilityStats
  },
  data() {
    return {};
  },

  methods: {},
};
</script>
