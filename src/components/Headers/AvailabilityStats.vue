<template>
  <!-- Header -->
  <div class="relative bg-emerald-600 bg-blend-multiply bg-cover md:pt-32 pb-32 pt-12" :style="{ backgroundImage: `url('${BackgroundImage}')` }">
    <div class="px-4 md:px-10 mx-auto w-full">
      <div>
        <!-- Card stats -->
        <div class="flex flex-wrap">
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
            <timeline-link v-on:click="$router.push({name:'Assignments'})"
              label="Assignments"
              title="View All Project Assignments"
              subLabel="Overall Wait Time"
              :subTitle="`${Math.floor(nextRSE.wait.months) > 0 ? Math.floor(nextRSE.wait.months) : 0} Months ${Math.floor(nextRSE.wait.days) > 0 ? Math.floor(nextRSE.wait.days) : 0 } Days`"
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
            <availability-card v-on:click="rse(`${nextMiddleware.firstname} ${nextMiddleware.lastname}`)"
              :image=getAvatar(nextMiddleware)
              label="MIDDLEWARE"
              :title="`${nextMiddleware.firstname} ${nextMiddleware.lastname}`"
              :subTitle=formatDate(nextMiddleware.nextAvailableDate)
              :value="`${Math.floor(nextMiddleware.wait.months) > 0 ? Math.floor(nextMiddleware.wait.months) : 0} Months ${Math.floor(nextMiddleware.wait.days) > 0 ? Math.floor(nextMiddleware.wait.days) : 0 } Days`"            
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
            <availability-card v-on:click="rse(`${nextWebMobile.firstname} ${nextWebMobile.lastname}`)"
              :image=getAvatar(nextWebMobile)
              label="WEB &amp; MOBILE"
              :title="`${nextWebMobile.firstname} ${nextWebMobile.lastname}`"
              :subTitle=formatDate(nextWebMobile.nextAvailableDate)
              :value="`${Math.floor(nextWebMobile.wait.months) > 0 ? Math.floor(nextWebMobile.wait.months) : 0} Months ${Math.floor(nextWebMobile.wait.days) > 0 ? Math.floor(nextWebMobile.wait.days) : 0 } Days`"
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
            <availability-card v-on:click="rse(`${nextDataScience.firstname} ${nextDataScience.lastname}`)"
              :image=getAvatar(nextDataScience)
              label="DATA SCIENCE"
              :title="`${nextDataScience.firstname} ${nextDataScience.lastname}`"
              :subTitle=formatDate(nextDataScience.nextAvailableDate)
              :value="`${Math.floor(nextDataScience.wait.months) > 0 ? Math.floor(nextDataScience.wait.months) : 0} Months ${Math.floor(nextDataScience.wait.days) > 0 ? Math.floor(nextDataScience.wait.days) : 0 } Days`"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AvailabilityCard from "@/components/Cards/Availability.vue"
import TimelineLink from "@/components/Cards/TimelineLink.vue"
import BackgroundImage from '@/assets/img/header.jpeg'
import { mapGetters } from 'vuex'

export default {
  components: {
    AvailabilityCard,
    TimelineLink
  },
  data() {
    return {
      avatars: [],
      getAvatar: (rse) => {
          let name = rse.firstname + ' ' + rse.lastname
          let avatar = this.avatars.find((avatar) => {
            return avatar.name === name.toLowerCase()
          })
          return new URL(`${avatar.pathLong}`, import.meta.url)
      },
      formatDate: (date) => {
        return new Date(date).toLocaleDateString()
      },
      BackgroundImage
    };
  },
  beforeMount() {
    this.importAvatars(import.meta.glob('@/assets/img/avatars/*.*'))
  },
  computed: {
    ...mapGetters('rses', ['nextRSE', 'nextWebMobile', 'nextMiddleware', 'nextDataScience'])
  },
  methods: {
    importAvatars(r) {
      Object.keys(r).forEach(key => {
        this.avatars.push({ 
          pathLong: key,
          pathShort: key.replace(/^.*[\\/]/, ''),
          name: key.replace(/^.*[\\/]/, '').split('.')[0].split('-').join(' ')
        })
      })
    },
    rse(name) {
      this.$router.push({ path: `/rse/${name.replace(/\s+/g, '-').toLowerCase()}` })
    }
  }
};
</script>
