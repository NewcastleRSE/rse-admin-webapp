import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DateTime } from 'luxon-business-days'
import { fetchObjects } from '../utils/orm'

export const useTimesheetsStore = defineStore('timesheets', () => {
    const timesheets = ref([])

    function getTimesheets() {
        return timesheets.value[0]
    }

    function getByID(id) {
        return timesheets.value.find(timesheet => timesheet.id == id)
    }

    function getByRSE(name) {
        return timesheets.value[0].team.find(rse => rse.name === name)
    }

    function getRSESummary(rse) {

        const nonBillableProjects = ['RSE Team', 'Carpentries', 'Management', 'Non-Project Event', 'Volunteering']

        let summary = {
            name: rse.displayName,
            capacity: 0,
            recorded: 0,
            billable: 0,
            nonBillable: 0,
            recoveryRate: 0,
            nonBillableProjects: {}
        }
    
        summary.capacity = rse.capacity

        const timesheets = getByRSE(rse.displayName)

        timesheets?.months.forEach(month => {
            month.projects.forEach(project => {

                if(nonBillableProjects.indexOf(project.name) === -1) {
                    summary.billable += project.days
                }
                else {
                    if(!summary.nonBillableProjects[project.name]) {
                        summary.nonBillableProjects[project.name] = 0
                    }
                    summary.nonBillable += project.days
                    summary.nonBillableProjects[project.name] += project.days
                }

                summary.recorded += project.days
            })
        })

        summary.recoveryRate = ((summary.billable/summary.capacity) * 100).toFixed(2) + '%'
    
        return summary
    }

    async function fetchTimesheets () {
        timesheets.value = await fetchObjects('timesheets', 0, 100)
    }

    async function reset () {
        timesheets.value = {}
    }

    return { timesheets, getTimesheets, getByID, getByRSE, getRSESummary, fetchTimesheets, reset }
},
{
    persist: true
})