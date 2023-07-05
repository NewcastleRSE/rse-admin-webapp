<template>
    <div class="w-full -mt-24">
      <div class="flex flex-wrap">
        <div class="w-full px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                <div class="rounded-t mb-0 px-4 py-3 border-0">
                    <div class="flex flex-wrap items-center">
                        <div class="relative w-full max-w-full flex-grow flex-1">
                        <h6 class="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
                            Team
                        </h6>
                        <h2 class="text-blueGray-700 text-xl font-semibold">
                            Overview
                        </h2>
                        </div>
                    </div>
                </div>
                <div class="block w-full overflow-x-auto px-4">
                    <ul role="list" class="divide-y divide-gray-100">
                        <list-item v-for="rse in rses" :key="rse.emaidil" :rse="rse" />
                    </ul>
                </div>
            </div>
        </div>
      </div>
    </div>
  <!-- <div class="w-full -mt-24">
    <div class="flex flex-wrap mx-4 bg-white w-full p-4 shadow-lg rounded">
        <ul role="list" class="divide-y divide-gray-100">
            <list-item v-for="rse in rses" :key="rse.emaidil" :rse="rse" />
        </ul>
    </div>
  </div> -->
</template>
<script setup>
import ListItem from '../components/Team/ListItem.vue'
import { useRSEsStore } from '../stores'

const rsesStore = useRSEsStore()
const rses = rsesStore.getRSEs()
</script>