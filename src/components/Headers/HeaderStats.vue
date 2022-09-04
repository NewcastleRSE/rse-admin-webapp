<template>
  <!-- Header -->
  <div class="relative bg-emerald-600 bg-blend-multiply bg-cover md:pt-32 pb-32 pt-12" :style="{ backgroundImage: 'url(' + require('@/assets/img/header.jpeg') + ')' }">
    <div class="px-4 md:px-10 mx-auto w-full">
      <div>
        <!-- Card stats -->
        <div class="flex flex-wrap">
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
            <availability-card v-on:click="rse(`${nextRSE.firstname} ${nextRSE.lastname}`)"
              :avatar=getAvatar(nextRSE)
              team="ALL"
              :name="`${nextRSE.firstname} ${nextRSE.lastname}`"
              :from=formatDate(nextRSE.nextAvailableDate)
              :waitTime=nextRSE.wait  
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
            <availability-card v-on:click="rse(`${nextMiddleware.firstname} ${nextMiddleware.lastname}`)"
              :avatar=getAvatar(nextMiddleware)
              team="MIDDLEWARE"
              :name="`${nextMiddleware.firstname} ${nextMiddleware.lastname}`"
              :from=formatDate(nextMiddleware.nextAvailableDate)
              :waitTime=nextMiddleware.wait              
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
            <availability-card v-on:click="rse(`${nextWebMobile.firstname} ${nextWebMobile.lastname}`)"
              :avatar=getAvatar(nextWebMobile)
              team="WEB &amp; MOBILE"
              :name="`${nextWebMobile.firstname} ${nextWebMobile.lastname}`"
              :from=formatDate(nextWebMobile.nextAvailableDate)
              :waitTime=nextWebMobile.wait  
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
            <availability-card v-on:click="rse(`${nextDataScience.firstname} ${nextDataScience.lastname}`)"
              :avatar=getAvatar(nextDataScience)
              team="DATA SCIENCE"
              :name="`${nextDataScience.firstname} ${nextDataScience.lastname}`"
              :from=formatDate(nextDataScience.nextAvailableDate)
              :waitTime=nextDataScience.wait 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AvailabilityCard from "@/components/Cards/Availability.vue"
import { mapGetters } from 'vuex'

export default {
  components: {
    AvailabilityCard,
  },
  data() {
    return {
      avatars: [],
      getAvatar: (rse) => {
          let name = rse.firstname + ' ' + rse.lastname
          let avatar = this.avatars.find((avatar) => {
            return avatar.name === name.toLowerCase()
          })
          return avatar ? avatar.pathLong : '' 
      },
      formatDate: (date) => {
        return new Date(date).toLocaleDateString()
      }
    };
  },
  mounted() {
    this.importAvatars(require.context('@/assets/img/avatars/', true, /\.(gif|jpe?g|tiff?|png|webp|bmp)$/));
  },
  computed: {
    ...mapGetters('rses', ['nextRSE', 'nextWebMobile', 'nextMiddleware', 'nextDataScience'])
  },
  methods: {
    importAvatars(r) {
      r.keys().forEach(key => (this.avatars.push({ pathLong: r(key), pathShort: key, name: (key.substring(2)).split('.')[0].split('-').join(' ') })));
    },
    rse(name) {
      this.$router.push({ path: `/rse/${name.replace(/\s+/g, '-').toLowerCase()}` })
    }
  }
};
</script>
