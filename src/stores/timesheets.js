import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DateTime } from 'luxon-business-days'
import { useLeaveStore } from './leave'
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

        const leaveStore = useLeaveStore(),
              leaveRequests = leaveStore.getByRSE(rse.username)

        const nonBillableProjects = ['RSE Team', 'Carpentries', 'Management', 'Non-Project Event', 'Volunteering', 'Induction']

        let summary = {
            name: rse.displayName,
            capacity: rse.capacity,
            recorded: 0,
            billable: 0,
            nonBillable: 0,
            leave: 0,
            missing: 0,
            recoveryRate: 0,
            nonBillableProjects: {}
        }

        leaveRequests.forEach(leave => {
            const leaveDate = DateTime.fromISO(leave.DATE)
            if(leaveDate <= DateTime.now() && leaveDate >= DateTime.fromISO(rse.contractStart)) {
                summary.leave += leave.DURATION === 'Y' ? 1 : 0.5
            }  
        })
    
        const workingDaysSoFar = (DateTime.now().workingDiff(DateTime.fromISO(rse.capacityStart), 'days') * (rse.capacity / 220)).toFixed(0)

        const timesheets = getByRSE(rse.displayName === 'Ben Daly' ? 'Ben' : rse.displayName)

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

        summary.missing = workingDaysSoFar - (summary.recorded + summary.leave)
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