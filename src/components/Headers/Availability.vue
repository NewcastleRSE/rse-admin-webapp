<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
      <timeline-link v-on:click="$router.push({name:'Assignments'})"
        label="Assignments"
        title="All Projects"
        subLabel="Overall Wait Time"
        :subTitle="`${Math.floor(nextRSE.wait.months) > 0 ? Math.floor(nextRSE.wait.months) : 0} Months ${Math.floor(nextRSE.wait.days) > 0 ? Math.floor(nextRSE.wait.days) : 0 } Days`"
      />
    </div>
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
      <availability-card v-on:click="$router.push({path:`/team/${(nextMiddleware.firstname + ' ' + nextMiddleware.lastname).replace(/\s+/g, '-').toLowerCase()}`})"
        :image="`/src/assets/img/avatars/${nextMiddleware.photo}`"
        label="MIDDLEWARE"
        :title="`${nextMiddleware.firstname} ${nextMiddleware.lastname}`"
        :subTitle=formatDate(nextMiddleware.nextAvailableDate)
        :value="`${Math.floor(nextMiddleware.wait.months) > 0 ? Math.floor(nextMiddleware.wait.months) : 0} Months ${Math.floor(nextMiddleware.wait.days) > 0 ? Math.floor(nextMiddleware.wait.days) : 0 } Days`"            
      />
    </div>
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
      <availability-card v-on:click="$router.push({path:`/team/${(nextWebMobile.firstname + ' ' + nextWebMobile.lastname).replace(/\s+/g, '-').toLowerCase()}`})"
        :image="`/src/assets/img/avatars/${nextWebMobile.photo}`"
        label="WEB &amp; MOBILE"
        :title="`${nextWebMobile.firstname} ${nextWebMobile.lastname}`"
        :subTitle=formatDate(nextWebMobile.nextAvailableDate)
        :value="`${Math.floor(nextWebMobile.wait.months) > 0 ? Math.floor(nextWebMobile.wait.months) : 0} Months ${Math.floor(nextWebMobile.wait.days) > 0 ? Math.floor(nextWebMobile.wait.days) : 0 } Days`"
      />
    </div>
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
      <availability-card v-on:click="$router.push({path:`/team/${(nextDataScience.firstname + ' ' + nextDataScience.lastname).replace(/\s+/g, '-').toLowerCase()}`})"
      :image="`/src/assets/img/avatars/${nextDataScience.photo}`"
        label="DATA SCIENCE"
        :title="`${nextDataScience.firstname} ${nextDataScience.lastname}`"
        :subTitle=formatDate(nextDataScience.nextAvailableDate)
        :value="`${Math.floor(nextDataScience.wait.months) > 0 ? Math.floor(nextDataScience.wait.months) : 0} Months ${Math.floor(nextDataScience.wait.days) > 0 ? Math.floor(nextDataScience.wait.days) : 0 } Days`"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AvailabilityCard from "@/components/Cards/Availability.vue"
import TimelineLink from "@/components/Cards/TimelineLink.vue"
import { useRSEsStore } from '@/stores/rses'

const rsesStore = useRSEsStore()

const nextRSE = ref(rsesStore.getNext()),
      nextMiddleware = ref(rsesStore.getNext('Middleware')),
      nextWebMobile = ref(rsesStore.getNext('WebMobile')),
      nextDataScience = ref(rsesStore.getNext('DataScience'))

function formatDate(date) {
  return new Date(date).toLocaleDateString()
}

</script>
