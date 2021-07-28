<template>
  <FindNextMember />
  <div class="columns"> 
    <div class="column">
      <div class="panel"> 
      <p class="panel-heading"> Value by Faculty</p>
      <Faculty />
      </div>
    </div>
    <div class="column">
      <div class="panel"> 
      <p class="panel-heading"> Value by Funders </p>
      <Funder />
      </div>
    </div>
  </div>
  <div class="columns">
    <div class="column">
      <EndDate />
    </div>
    <div class="column" >
      <Total />
    </div>
  </div>

</template>

<script>
import Faculty from "../components/Dashboard/Faculty.vue";
import Funder from "../components/Dashboard/Funder.vue";
import Total from "../components/Dashboard/Total.vue";
import EndDate from "../components/Dashboard/EndDate.vue";
import FindNextMember from "../components/Dashboard/FindNextMember.vue";

export default {
  name: "dashboard",
  components: { Faculty, Funder, Total, EndDate, FindNextMember},
  data() {
    return {};
  },
  //created() {},

  methods: {},
};
</script>
