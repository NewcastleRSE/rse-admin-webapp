import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchObjects } from '../utils/orm'

export const useFacilitiesStore = defineStore('facilities', () => {
    const facilities = ref([])

    function getFacilities() {
        return facilities.value
    }

    function getByID(documentId) {
        return facilities.value.find(facility => facility.documentId == documentId)
    }

    function getByYear(year) {
        return facilities.value.find(facility => facility.year == year)
    }

    async function fetchFacilities () {
        facilities.value = await fetchObjects('facilities', 0, 100)
    }

    async function reset () {
        facilities.value = []
    }

    return { facilities, getFacilities, getByID, getByYear, fetchFacilities, reset }
},
{
    persist: true
})