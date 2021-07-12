<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ project.name }}</p>
        <button class="delete" aria-label="close" @click="toggleModal"></button>
      </header>
      <section class="modal-card-body">
        <h2>Will make look better later</h2>
        <p>Amount: {{ project.amount }}</p>
        <p>Stage: {{ project.stage }}</p>
        <p>Faculty: {{ project.faulty }}</p>
        <p>Finance Contact: {{ project.financeContact }}</p>
        <p>Funding Body: {{ project.fundingBody }}</p>
        <p>Project Lead: {{ project.projectLead }}</p>
        <p>Project Value: {{ project.projectValue }}</p>
        <p>School: {{ project.school }}</p>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success">Save changes</button>
        <button class="button">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectModal",
  props: ["project"],
  data() {
    return {
      modal: false,
    };
  },
  methods: {
    toggleModal() {
      this.$emit("toggleModal");
    },
  },
};
</script>
