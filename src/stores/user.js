import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { Buffer } from 'buffer'
import router from '../router'
import { currentFY } from '../utils/dates'
import * as Stores from '@/stores'

export const useUserStore = defineStore('user', () => {

    const assignmentsStore = Stores.useAssignmentsStore(),
          facilitiesStore = Stores.useFacilitiesStore(),
          invoicesStore = Stores.useInvoicesStore(),
          projectsStore = Stores.useProjectsStore(),
          rsesStore = Stores.useRSEsStore(),
          transactionsStore = Stores.useTransactionsStore()

    const accessToken = ref('')
    const jwt = ref('')
    const user = ref({})
    const settings = ref({})

    function login(token) {
        const loginUrl = import.meta.env.VITE_API_URL + '/auth/microsoft/callback/?access_token=' + token
        const azureConfig = { headers: { Authorization: `Bearer ${token}` }}
        const currentYear = currentFY()

        let fetchJWT = axios.get(loginUrl)
        let fetchProfile = axios.get('https://graph.microsoft.com/v1.0/me', azureConfig)
        let fetchPhoto = axios.get('https://graph.microsoft.com/v1.0/me/photo/$value', {...azureConfig, responseType: 'arraybuffer'})

        Promise.all([fetchJWT, fetchProfile, fetchPhoto])
        .then((values) => {

            let profile = values[1].data
                profile.photo = Buffer.from(values[2].data, 'binary').toString('base64')

            accessToken.value = token
            jwt.value = values[0].data.jwt
            user.value = profile
            settings.value = {
                financialYear: currentYear.startDate.year,
                defaultTeam: 'all'
            }

            projectsStore.fetchProjects().then(() => {
                Promise.all([
                    assignmentsStore.fetchAssignments(),
                    facilitiesStore.fetchFacilities(),
                    invoicesStore.fetchInvoices(currentYear.startDate.year),
                    rsesStore.fetchRSEs(currentYear.startDate.year),
                    transactionsStore.fetchTransactions(currentYear.startDate.year)
                ]).then(() => {
                    router.push({ name: "Dashboard" })
                }).catch(error => {
                    console.error(error)
                })
            }).catch(error => {
            console.error(error)
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    async function reset () {
        accessToken.value = null
        jwt.value = null
        user.value = null
      }

    return { accessToken, jwt, user, settings, login, reset }
},
{ 
    persist: true
})