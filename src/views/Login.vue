<template>
  <div class="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
    <nclLogo class="my-6" />
    <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">RSE Admin</h1>
    <p class="relative my-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">A web portal for the administration and project forecasting of the Newcastle University Research Software Engineering Team.</p>
    <a v-if="!accessToken" type="button" :href="apiUrl + '/connect/microsoft'" class="inline-flex items-center gap-x-2 rounded-md bg-cyan-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600">
      Newcastle University SSO
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
      </svg>
    </a>
    <div v-else>
      <h2 class="mb-6 font-semibold text-blueGray-700 dark:text-white">Loading...</h2>
      <ul class="max-w-md space-y-1 text-blueGray-700 font-semibold list-inside dark:text-gray-400">
        <li class="flex items-center">
            <svg v-if="rses.length > 0 && capacities.length > 0 && timesheets.length > 0" class="w-4 h-4 mr-1.5 text-cyan-500 dark:text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
            <svg v-else class="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <component :is="'style'" type="text/css">.spinner_ajPY{transform-origin:center;animation:spinner_AtaB .75s infinite linear}@keyframes spinner_AtaB{100%{transform:rotate(360deg)}}</component><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" class="spinner_ajPY"/>
            </svg>
            RSEs
        </li>
        <li class="flex items-center">
            <svg v-if="projects.length > 0 && assignments.length > 0" class="w-4 h-4 mr-1.5 text-cyan-500 dark:text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
            <svg v-else class="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <component :is="'style'" type="text/css">.spinner_ajPY{transform-origin:center;animation:spinner_AtaB .75s infinite linear}@keyframes spinner_AtaB{100%{transform:rotate(360deg)}}</component><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" class="spinner_ajPY"/>
            </svg>
            Projects
        </li>
        <li class="flex items-center">
            <svg v-if="facilities.length > 0 && transactions.length > 0" class="w-4 h-4 mr-1.5 text-cyan-500 dark:text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
            <svg v-else class="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <component :is="'style'" type="text/css">.spinner_ajPY{transform-origin:center;animation:spinner_AtaB .75s infinite linear}@keyframes spinner_AtaB{100%{transform:rotate(360deg)}}</component><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" class="spinner_ajPY"/>
            </svg>
            Finances
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue'
import { storeToRefs } from 'pinia'
import * as Stores from '@/stores'
import nclLogo from '@/assets/img/ncl-logo.svg'

const assignmentsStore = Stores.useAssignmentsStore(),
      authStore = Stores.useAuthStore(),
      capacitiesStore = Stores.useCapacitiesStore(),
      facilitiesStore = Stores.useFacilitiesStore(),
      projectsStore = Stores.useProjectsStore(),
      rsesStore = Stores.useRSEsStore(),
      timesheetsStore = Stores.useTimesheetsStore(),
      transactionsStore = Stores.useTransactionsStore()

const { assignments } = storeToRefs(assignmentsStore)
const { capacities } = storeToRefs(capacitiesStore)
const { facilities } = storeToRefs(facilitiesStore)
const { projects } = storeToRefs(projectsStore)
const { rses } = storeToRefs(rsesStore)
const { timesheets } = storeToRefs(timesheetsStore)
const { transactions } = storeToRefs(transactionsStore)

const apiUrl = ref(import.meta.env.VITE_API_URL)

let accessToken = null

onBeforeMount(() => {
  accessToken = new URLSearchParams(window.location.search).get('access_token')
  if (accessToken) { authStore.login(accessToken) }
})
</script>
