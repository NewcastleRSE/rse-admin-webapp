<template>
  <Timeline class="chart" />
</template>

<script>
import Timeline from "../components/User/Timeline.vue";

export default {
  name: "user",
  components: { Timeline },
  data() {
    return {};
  },

  methods: {},
};
</script>

<style scoped>
.chart {
  width: 75%;
}
</style>
