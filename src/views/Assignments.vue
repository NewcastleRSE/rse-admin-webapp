<template>
  <div class="gantt">
    <AssignmentGantt />
  </div>
</template>

<script>
import AssignmentGantt from "../components/Assignments/AssignmentGantt.vue";

export default {
  name: "Assignments",
  components: { AssignmentGantt },
};
</script>

<style scoped>
.gantt {
  height: 100%;
}
</style>
