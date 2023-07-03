import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchObjects } from '../utils/orm'

export const useFacilitiesStore = defineStore('facilities', () => {
    const facilities = ref([])

    function getFacilities() {
        return facilities.value
    }

    function getByID(id) {
        return facilities.value.find(facility => facility.id == id)
    }

    async function fetchFacilities () {
        facilities.value = await fetchObjects('facilities', 0, 100)
    }

    return { facilities, getFacilities, getByID, fetchFacilities }
},
{
    persist: true
})