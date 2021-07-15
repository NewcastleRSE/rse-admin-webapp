<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Create Assignment For {{ project.name }}</p>
        <button class="delete" aria-label="close" @click="toggleModal"></button>
      </header>

      <section class="modal-card-body">
        <!-- Inside of modal starts here -->
        <div>
          <form
            v-on:submit.prevent="onSubmit"
            id="dialogue"
            class="openDialogue"
          >
            <!-- Example of using project properties -->
            <p ref="prjName" id="prjName">{{ project.name }}</p>
            <!-- Example of using project properties -->
            <label for="start">Start date</label><br />
            <input type="date" id="start" name="start" v-model="start" /><br />

            <label for="end">End date</label><br />
            <input type="date" id="end" name="end" v-model="end" /><br />

            <br />
            <select id="select" v-model="user">
              <option disabled value="">Please select one</option>
              <option v-for="member in members" v-bind:key="member">{{
                member
              }}</option>
            </select>

            <br />

            <input type="submit" value="Add" @click="addAssignment" />
            <input type="button" value="Cancel" @click="cancel()" />
          </form>
        </div>
        <!-- Inside of modal ends here -->
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "AssignmentsFormModal",
  props: ["project"],
  data() {
    return { members: null, start: null, end: null, user: null };
  },
  create() {
    this.members = this.$store.state.members.members;
  },
  methods: {
    toggleModal() {
      this.$emit("toggleModal");
    },

    addAssignment() {
      const assignment = {
        member: this.user,
        start: new Date(this.start), // convert UTC time to Date // might have to use new Date in variable before obj
        end: this.end,
        project: this.project,
      };

      console.log(assignment);
    },
  },
};
</script>
