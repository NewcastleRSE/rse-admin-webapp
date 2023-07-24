import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchObjects } from '../utils/orm'

export const useProjectsStore = defineStore('projects', () => {
    const projects = ref([])

    function getProjects() {
        return projects.value.sort(function(a, b) {
            let textA = a.dealname.toUpperCase();
            let textB = b.dealname.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        })
    }

    function getByID(id) {
        return projects.value.find(project => project.id == id)
    }

    function getByHubspotID(id) {
        return projects.value.find(project => project.hubspotId == id)
    }

    function filterByIDs(ids) {
        return projects.value.filter(project => ids.includes(project.id))
    }

    async function fetchProjects () {
        projects.value = await fetchObjects('projects', 0, 100)
    }

    async function reset () {
        projects.value = []
    }

    return { projects, getProjects, getByID, getByHubspotID, filterByIDs, fetchProjects, reset }
},
{
    persist: true
})