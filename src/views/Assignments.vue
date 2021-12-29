<template>
    <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 px-4">
      <card-assignments />
    </div>
  </div>
</template>

<script>
import CardAssignments from '../components/Cards/CardAssignments.vue';

export default {
  name: "Assignments",
  components: { CardAssignments },
};
</script>