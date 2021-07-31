<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ project.name }}</p>
        <button class="delete" aria-label="close" @click="toggleModal"></button>
      </header>
      <section class="modal-card-body">
        <!-- Inside of modal starts here -->
        <div class="tile is-ancestor is-vertical">
          <div class="tile is-parent top-of-modal">
            <div class="tile is-child is-5 box">
              <h2 class="subtitle">Finance</h2>
              <p v-if="project.amount">Amount: £{{ project.amount }}</p>
              <p v-if="project.financeContact">
                Finance Contact: {{ project.financeContact }}
              </p>
              <p v-if="project.fundingBody">
                Funding Body: {{ project.fundingBody }}
              </p>
              <p v-if="project.projectValue">
                Project Value: £{{ project.projectValue }}
              </p>
              <p></p>
            </div>

            <div class="tile is-child is-5 box">
              <p v-if="project.stage" class="block">
                Stage: {{ project.stage }}
              </p>
              <p v-if="project.faulty">Faculty: {{ project.faulty }}</p>
              <p v-if="project.projectLead">
                Project Lead: {{ project.projectLead }}
              </p>
              <p v-if="project.school">School: {{ project.school }}</p>
            </div>
          </div>
          <div class="tile is-child">
            Gantt goes here
          </div>
        </div>
        <!-- Inside of modal ends here -->
      </section>
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
      this.$emit("toggleProjectModal");
    },
  },
};
</script>

<style scoped>
.top-of-modal {
  justify-content: space-between;
}
</style>
