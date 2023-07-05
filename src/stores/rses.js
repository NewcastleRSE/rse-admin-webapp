import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DateTime } from 'luxon'
import { fetchObjects } from '../utils/orm'

export const useRSEsStore = defineStore('rses', () => {
    const rses = ref([])

    function getRSEs() {
        return rses.value.sort(function(a, b) {
            return a.lastname.localeCompare(b.lastname);
        })
    }

    function getByName(name) {
        return rses.value.find(rse => `${rse.firstname.replace(/\s+/g, '-').toLowerCase()}-${rse.lastname.replace(/\s+/g, '-').toLowerCase()}` == name)
    }

    function getByID(id) {
        return rses.value.find(rse => rse.id == id)
    }

    function getNext(teamName) {

        let team = rses.value.filter(rse => rse.nextAvailableDate && rse.active)

        if(teamName) {
            team = team.filter(rse => rse.team === teamName)
        }

        team.sort((a, b) => { return DateTime.fromISO(a.nextAvailableDate) - DateTime.fromISO(b.nextAvailableDate) } )
          
          let index = 0

          if(`${team[0].firstname} ${team[0].lastname}` === 'Mark Turner') {
            index = 1
          }
          
          let nextRSE = team[index]
          nextRSE.wait = DateTime.fromISO(nextRSE.nextAvailableDate).diff(DateTime.now(), ['months', 'days']).toObject()
          
          return nextRSE
    }

    async function fetchRSEs () {
        let rseData = await fetchObjects('rses', 0, 100, ['assignments', 'assignments.project'])

        Object.keys(import.meta.glob('@/assets/img/avatars/*.*')).forEach(key => {

            const rseIndex = rseData.findIndex(rse => {
                let name = `${rse.firstname} ${rse.lastname}`
                return name.toLowerCase() === key.replace(/^.*[\\/]/, '').split('.')[0].split('-').join(' ')
            })

            rseData[rseIndex].photo = key.replace(/^.*[\\/]/, '')
            rseData[rseIndex].displayName = `${rseData[rseIndex].firstname} ${rseData[rseIndex].lastname}`
        })

        rses.value = rseData
    }

    return { rses, getRSEs, getByName, getByID, getNext, fetchRSEs }
},
{
    persist: true
})