import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DateTime } from 'luxon'
import { fetchObject, fetchObjects } from '../utils/orm'

export const useRSEsStore = defineStore('rses', () => {
    const rses = ref([]),
          utilisation = ref({})

    function getRSEs() {
        return rses.value.sort(function(a, b) {
            return a.lastname.localeCompare(b.lastname)
        })
    }

    function getByName(name) {
        return rses.value.find(rse => `${rse.firstname.replace(/\s+/g, '-').toLowerCase()}-${rse.lastname.replace(/\s+/g, '-').toLowerCase()}` == name)
    }

    function getByID(id) {
        return rses.value.find(rse => rse.id == id)
    }

    function getUtilisation(id = null) {
        if(id) {
            return utilisation.value.rses[id]
        } else {
            return utilisation.value
        }
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

    async function fetchRSEs (year) {
        const startDate = DateTime.fromISO(`${year}-08-01`),
              endDate = DateTime.fromISO(`${(year + 1)}-07-31`)
    
        const contractRangeFilter = {
            $and: [
              {
                contractStart: { 
                    $lt: endDate.toISODate()
                }
              },
              {
                capacities: {
                    $or: [
                        {
                            end: { 
                                $between: [startDate.toISODate(), endDate.toISODate() ]
                            }
                        },
                        {
                            end: { 
                                $null: true
                            }
                        }
                    ]
                }
              }
            ]
          }

        let rseData = await fetchObjects('rses', 0, 100, null, contractRangeFilter),
            utilisationData = await fetchObject('timesheets', 'utilisation', null, { year: { '$eq': year } })


        Object.keys(import.meta.glob('@/assets/img/avatars/*.*')).forEach(key => {

            const rseIndex = rseData.findIndex(rse => {
                let name = `${rse.firstname} ${rse.lastname}`
                return name.toLowerCase() === key.replace(/^.*[\\/]/, '').split('.')[0].split('-').join(' ')
            })

            if(rseIndex > -1) {
                delete rseData[rseIndex].calendar
                rseData[rseIndex].photo = key.replace(/^.*[\\/]/, '')
            }
        })

        rses.value = rseData,
        utilisation.value = utilisationData
    }

    async function reset () {
        rses.value = [],
        utilisation.value = {}
    }

    return { rses, utilisation, getRSEs, getByName, getByID, getUtilisation, getNext, fetchRSEs, reset }
},
{
    persist: true
})