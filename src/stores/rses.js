import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DateTime } from 'luxon'
import { currentFY } from '../utils/dates'
import { fetchObject, fetchObjects } from '../utils/orm'

export const useRSEsStore = defineStore('rses', () => {

    const rses = ref([]),
          utilisation = ref({}),
          currentYear = currentFY()

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

    function getUtilisation(id = null, wholeMonths = false) {

        let data

        if(wholeMonths) {
            // Deep clone the object to avoid mutating the store state
            data = JSON.parse(JSON.stringify(utilisation.value))
        }
        else {
            data = utilisation.value
        }

        if(wholeMonths) {
            for(const month in data.months) {
                const monthDate = DateTime.fromFormat(`${currentYear.startDate.year}-${month}-01`, 'yyyy-MMMM-dd').endOf('month')
                const now = DateTime.now().endOf('month')

                // If the month is the current month or in the future, remove it from the list. Missing timesheets will suppress the utilisation rate
                if (monthDate >= now) {
                    delete data.months[month]
                    continue
                }

                data.months[month].utilisation = data.months[month].recorded / data.months[month].capacity * 100
            }

            // Compute new totals due to possible deletions above
            const totalCapacity = Object.keys(data.months).reduce((acc, month) => acc + data.months[month].capacity, 0),
                  totalRecorded = Object.keys(data.months).reduce((acc, month) => acc + data.months[month].recorded, 0)
            
            data.total = {
                capacity: totalCapacity,
                recorded: totalRecorded,
                utilisation: totalRecorded / totalCapacity * 100
            }
        }  
        
        if(id) {
            return data.rses[id]
        } else {
            return data
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
        utilisation.value = utilisationData.data
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