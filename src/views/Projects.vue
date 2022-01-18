<template>
  <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 px-4">
      <card-projects />
    </div>
  </div>
</template>

<script>
import CardProjects from "@/components/Cards/CardProjects.vue";

export default {
  name: "projects",
  components: { 
    CardProjects
  },
  data() {
    return {};
  },

  methods: {},
};
</script>
