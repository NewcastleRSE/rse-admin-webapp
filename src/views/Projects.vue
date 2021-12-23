<template>
  <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 px-4">
      <card-table />
      <!-- <ProjectsGantt class="chart" /> -->
    </div>
  </div>
</template>

<script>
import CardTable from "@/components/Cards/CardTable.vue";
// import ProjectsGantt from "@/components/Projects/ProjectsGantt.vue";

export default {
  name: "projects",
  components: { 
    CardTable,
    // ProjectsGantt
  },
  data() {
    return {};
  },

  methods: {},
};
</script>
