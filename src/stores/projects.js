import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DateTime } from 'luxon'
import { fetchObjects, updateObject } from '../utils/orm'

export const useProjectsStore = defineStore('projects', () => {
    const projects = ref([])

    function getProjects() {
        return projects.value.sort(function(a, b) {
            let textA = a.name.toUpperCase();
            let textB = b.name.toUpperCase();
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

    async function changeStatus(id, status) {
        const response = await updateObject('projects', id, { status: status})
        const index = projects.value.findIndex((project) => project.id === response.id)

        projects.value[index].status = response.status
    }

    async function fetchProjects (year) {

        const dates = {
            startDate: DateTime.fromISO(`${year}-08-01`),
            endDate: DateTime.fromISO(`${(year + 1)}-07-31`)
        }
    
        const dateRangeFilter = {
            $or: [{
                assignments: {
                    $or: [
                    { 
                        start: {
                            $between: [dates.startDate.toISODate(), dates.endDate.toISODate() ]
                        }
                    },
                    {
                        end: { 
                            $between: [dates.startDate.toISODate(), dates.endDate.toISODate() ]
                        }
                    },
                    {
                        start: { 
                            $lt: dates.startDate.toISODate()
                        },
                        end: {
                            $gt: dates.endDate.toISODate()
                        }
                    }
                    ]
                }
            },
            {
               stage: {
                   $in: ['Awaiting Allocation']
               } 
            }]
        }

        projects.value = await fetchObjects('projects', 0, 100, ['contacts', 'assignments'], dateRangeFilter)
    }

    async function reset () {
        projects.value = []
    }

    return { projects, getProjects, getByID, getByHubspotID, filterByIDs, changeStatus, fetchProjects, reset }
},
{
    persist: true
})