<template>
  <!-- Header -->
  <div class="relative bg-emerald-600 md:pt-32 pb-32 pt-12">
    <div class="px-4 md:px-10 mx-auto w-full">
      <div>
        <!-- Card stats -->
        <div class="flex flex-wrap">
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
            <availability-card
              :avatar=getAvatar(nextMiddleware.name)
              team="ALL"
              :name=nextMiddleware.name
              :from=nextMiddleware.from
              :waitTime=nextMiddleware.wait  
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
            <availability-card
              :avatar=getAvatar(nextMiddleware.name)
              team="MIDDLEWARE"
              :name=nextMiddleware.name
              :from=nextMiddleware.from
              :waitTime=nextMiddleware.wait              
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
            <availability-card
              :avatar=getAvatar(nextWebMobile.name)
              team="WEB &amp; MOBILE"
              :name=nextWebMobile.name
              :from=nextWebMobile.from
              :waitTime=nextWebMobile.wait  
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
            <availability-card
              :avatar=getAvatar(nextDataScience.name)
              team="DATA SCIENCE"
              :name=nextDataScience.name
              :from=nextDataScience.from
              :waitTime=nextDataScience.wait 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AvailabilityCard from "@/components/Cards/Availability.vue";

function weeksBetween(d1, d2) {
    return Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1000));
}

function nextAvailable(teams, teamName) {
  var mostRecentDate = new Date(Math.min.apply(null, teams[teamName].map( e => {
      if(e.availability.from) {
        return e.availability.from;
      } else {
        // return a date 100 years in the future to avoid 1970 being min date
        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth();
        var day = today.getDate();
        return new Date(year + 100, month, day);
      }
      
    })));
    let member = teams[teamName].filter( e => {
        return new Date(e.availability.from).getTime() === mostRecentDate.getTime();
    })[0];

    console.log(member)

    return {
      from: member.availability.from.toLocaleDateString(),
      to: member.availability.to ? member.availability.to.toLocaleDateString() : null,
      FTE: member.availability.FTE,
      wait: weeksBetween(new Date(), member.availability.from) + " Weeks",
      name: member.firstname + ' ' + member.lastname,
    }
}

export default {
  components: {
    AvailabilityCard,
  },
  data() {

    const teams = this.$store.getters["members/getFullMembers"].reduce(function (r, a) {
        r[a.team] = r[a.team] || [];
        r[a.team].push(a);
        return r;
    }, Object.create(null));

    return {
      nextDataScience: nextAvailable(teams, 'DataScience'),
      nextMiddleware: nextAvailable(teams, 'Middleware'),
      nextWebMobile: nextAvailable(teams, 'WebMobile'),
      avatars: [],
      getAvatar: (rse) => {
          let avatar = this.avatars.find((avatar) => {
            return avatar.name === rse.toLowerCase()
          })
          return avatar ? avatar.pathLong : '' 
      },
    };
  },
  mounted() {
    this.importAvatars(require.context('@/assets/img/avatars/', true, /\.(gif|jpe?g|tiff?|png|webp|bmp)$/));
  },
  methods: {
    importAvatars(r) {
      r.keys().forEach(key => (this.avatars.push({ pathLong: r(key), pathShort: key, name: (key.substring(2)).split('.')[0].split('-').join(' ') })));
    },
  }
};
</script>
