import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchObjects } from '../utils/orm'

export const useCapacitiesStore = defineStore('capacities', () => {
    const capacities = ref([])

    function getCapacities() {
        return capacities.value
    }

    function getByID(id) {
        return capacities.value.find(capacity => capacity.id == id)
    }

    async function fetchCapacities () {
        capacities.value = await fetchObjects('capacities', 0, 100, ['rse'])
    }

    return { capacities, getCapacities, getByID, fetchCapacities }
},
{
    persist: true
})