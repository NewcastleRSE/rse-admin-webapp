import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchObjects } from '../utils/orm'

export const useProjectsStore = defineStore('projects', () => {
    const projects = ref([])

    function getProjects() {
        return projects.value
    }

    function getByID(id) {
        return projects.value.find(project => project.id == id)
    }

    async function fetchProjects () {
        projects.value = await fetchObjects('projects', 0, 100, ['rse', 'project'])
    }

    return { projects, getProjects, getByID, fetchProjects }
},
{
    persist: true
})