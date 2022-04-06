<template>
  <AssignmentGantt />
  <button @click="addAss">Add Assignment</button>
</template>

<script>
import AssignmentGantt from "../components/Assignments/AssignmentGantt.vue";

export default {
  name: "max",
  components: { AssignmentGantt },
  methods: {
    addAss() {
      const ass = {
        rse: { id: 2 },
        startDate: "2021-07-21T11:00:00.000Z",
        endDate: "2021-08-01T11:00:00.000Z",
        project: { id: 2 },
      };

      this.$store.dispatch("assignments/createAssignment", ass);
    },
  },
};
</script>

<style scoped>
.chart {
  width: 75%;
}
</style>
