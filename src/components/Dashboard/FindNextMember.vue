

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
import { onUpdated } from '@vue/runtime-core';

export default {
    data() {
        return {
            assignments: null,
            members: null,
            person: {username: "None"},
            webDev: {username: "None"},
            dataScience: {username: "None"},
            integrations: {username: "None"},
        }
    },

    methods: {
        findNext(assignments, members, team = "") {
        let min = { end: "-1", username: "None"};
        assignments.forEach((assign) => {
            let member = null;
            if (team === "") {
                member = members.filter((memb) => memb.id == assign.parent)
            } else {
                member = members.filter((memb) => memb.id == assign.parent && memb.team === team)
            }
            if (member[0] && (min.end < assign.end || min.end == -1)) {
                assign["username"] = member[0].name
                min = assign;
            }
        })
        return min;} 
    },

    async created() {
        this.assignments = this.getAssignments;
        this.members = this.getMembers;
        //console.log(members)
        this.webDev = this.getWebDev;
        this.integrations = this.getIntegrations;
        this.dataScience = this.getDataScience;
        this.person = this.getPerson;
    },

    computed: {
        getAssignments() {
            return this.$store.getters["assignments/getAssignments"];
        
        },

        getWebDev() {
            return this.findNext(this.getAssignments, this.getMembers, "WebMobile");
        },

        getIntegrations() {
            return this.findNext(this.getAssignments, this.getMembers, "Integrations");
        },

        getDataScience() {
            return this.findNext(this.getAssignments, this.getMembers, "DataScience");
        },

        getMembers() {
            return this.$store.getters["members/getMembers"];
        },

        getPerson() {
            return this.findNext(this.getAssignments, this.getMembers);
        }
    },

    watch: {
        getAssignments(update) {
            this.assignments = update;
        },

        getMembers(update) {
            this.members = update;
        },

        getWebDev(update) {
             this.webDev = update;
        },

        getIntegrations(update) {
            this.integrations = update;
        },

        getDataScience(update) { 
            this.dataScience = update;
        },

        getPerson(update) {
            this.person = update;
        }

    }
    
}
</script>


