

<template>
  
 
  <div class="columns is-multiline">
        <div class="column">   
            <article class="box notification is-primary" >
            <p class="heading"><font-awesome-icon icon="user"/> Next available person</p>
            <p class="title">{{person.username}}</p>
            </article>
        </div>
        <div class="column">
            <article class="box notification is-warning">
            <p class="heading"><font-awesome-icon icon="user"/> Next available web dev</p>
            <p class="title">{{webDev.username}}</p>
            </article>
        </div>

        <div class="column">
            <article class="box notification is-info">
            <p class="heading"><font-awesome-icon icon="user"/> Next available data science</p>
            <p class="title">{{dataScience.username}}</p>
            </article>
        </div>

        <div class="column">
            <article class="box notification is-danger">
            <p class="heading"><font-awesome-icon icon="user"/> Next available integrations</p>
            <p class="title">{{integrations.username}}</p>
            </article>
        </div>

</div>

</template>

<script>

export default {
    data() {
        return {
            assignments: null,
            members: null,
            person: null,
            webDev: null,
            dataScience: null,
            integrations: null,
        }
    },

    methods: {
        findNext(assignments, members, team = "") {
        let min = { end: "-1" };
        assignments.forEach((assign) => {
            let member = null;
            if (team === "") {
                member = members.filter((memb) => memb.id == assign.name)
            } else {
                member = members.filter((memb) => memb.id == assign.name && memb.team === team)
            }
            if (member[0] && (min.end < assign.end || min.end == -1)) {
                assign["username"] = member[0].name
                min = assign;
            }
        })
        return min;} 
    },

    created() {
        let assignments = this.getAssignments;
        let members = this.getMembers;
        this.webDev= this.findNext(assignments, members, "WebMobile");
        this.integrations = this.findNext(assignments, members, "Integrations");
        this.dataScience = this.findNext(assignments, members, "DataScience");
        this.person = this.findNext(assignments, members);
    },

    computed: {
        getAssignments() {
            return this.$store.getters["assignments/getAssignments"];
        
        },

        getMembers() {
            return this.$store.getters["members/getMembers"];
        }
    },

    watch: {
        getAssignments(update) {
            this.assignments = update;
        },

        getMembers(update) {
            this.members = update;
        }
    }
    
}
</script>


