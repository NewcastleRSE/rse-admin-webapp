<template>
  <AssignmentGantt />
</template>

<script>
import AssignmentGantt from "../components/Assignments/AssignmentGantt.vue";

export default {
  name: "max",
  components: { AssignmentGantt },
};
</script>

<style scoped>
.chart {
  width: 75%;
}
</style>
