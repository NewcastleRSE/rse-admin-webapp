<template>
  <div class="box notification is-link">
    <p><span> Total: </span> {{ total }}</p>
  </div>
</template>

<script>
import { format } from 'money-formatter';

export default {
  name: "total",
  data() {
      return {
          total: 0
      }
  },
  async created() {
    this.total = this.getTotal
  },

  methods: {},
  computed: {
    getTotal() {
        let projects = this.$store.getters["projects/getProjects"];
        let total = 0;
        projects.forEach( (project) => {
            let add = (project.amount) ? Number(project.amount) : 0;
            total += add;
        })
        return format('GBP', total);
    },
    
  },
  watch: {
    getTotal(update) {
        this.total = update;

    },
   
  },
};
</script>