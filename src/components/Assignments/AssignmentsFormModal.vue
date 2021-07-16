<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <form v-on:submit.prevent="onSubmit">
        <header class="modal-card-head">
          <p class="modal-card-title">
            Create Assignment For {{ project.name }}
          </p>
          <button
            class="delete"
            aria-label="close"
            @click="toggleModal"
          ></button>
        </header>
        <!-- Inside of modal starts here -->

        <section class="modal-card-body">
          <div classclass="field">
            <label class="label" for="start">Start date</label>
            <div class="control">
              <input
                class="input is-info"
                type="date"
                id="start"
                name="start"
                v-model="start"
              />
            </div>
          </div>

          <div class="field">
            <label class="label" for="end">End date</label>
            <div class="control">
              <input
                class="input is-info"
                type="date"
                id="end"
                name="end"
                v-model="end"
              />
            </div>
          </div>

          <div class="field">
            <label class="label">User</label>
            <div class="control">
              <div class="select">
                <select class="select is-info" id="select" v-model="user">
                  <option disabled value="">Please select one</option>
                  <option
                    v-for="member in members"
                    :id="member.id"
                    v-bind:key="member"
                    v-bind:value="member.id"
                    >{{ member.firstname + " " + member.surname }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <footer class="modal-card-foot">
          <div class="field is-grouped">
            <div class="control">
              <button class="button is-link" @click="addAssignment">
                Submit
              </button>
            </div>
            <div class="control">
              <button class="button is-link is-light" @click="test">
                Cancel
              </button>
            </div>
          </div>
        </footer>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AssignmentsFormModal",
  props: ["project"],
  emits: ["toggleModal", "addAssignment", "test"],

  data() {
    return { members: null, start: null, end: null, user: null };
  },
  created() {
    this.members = this.$store.state.members.members;
  },
  methods: {
    toggleModal() {
      this.$emit("toggleModal");
    },

    addAssignment() {
      const assignment = {
        member: this.user,
        startDate: new Date(this.start), // convert UTC time to Date // might have to use new Date in variable before obj
        endDate: this.end,
        project: this.project.id,
      };
      //console.log(assignment);
      this.$emit("addAssignment", assignment);
    },

    test() {
      console.log("before emit");
      this.$emit("test");
    },
  },
};
</script>
