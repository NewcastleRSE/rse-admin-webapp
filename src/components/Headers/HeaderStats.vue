<template>
  <!-- Header -->
  <div class="relative bg-emerald-600 md:pt-32 pb-32 pt-12">
    <div class="px-4 md:px-10 mx-auto w-full">
      <div>
        <!-- Card stats -->
        <div class="flex flex-wrap">
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
            <card-stats
              statSubtitle="ALL"
              :statTitle=nextMiddleware.from
              statArrow="up"
              statPercent="3.48"
              statPercentColor="text-emerald-500"
              :statDescripiron=nextMiddleware.wait
              statIconName="far fa-chart-bar"
              statIconColor="bg-red-500"
              statUserLink="/user"
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
            <card-stats
              statSubtitle="MIDDLEWARE"
              :statTitle=nextMiddleware.from
              statArrow="down"
              statPercent="3.48"
              statPercentColor="text-red-500"
              :statDescripiron=nextMiddleware.wait
              statIconName="fas fa-chart-pie"
              statIconColor="bg-orange-500"
              statUserLink="/user"
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
            <card-stats
              statSubtitle="WEB &amp; MOBILE"
              :statTitle=nextWebMobile.from
              statArrow="down"
              statPercent="1.10"
              statPercentColor="text-orange-500"
              :statDescripiron=nextWebMobile.wait
              statIconName="fas fa-users"
              statIconColor="bg-pink-500"
              statUserlink="/user"
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
            <card-stats
              statSubtitle="DATA SCIENCE"
              :statTitle=nextDataScience.from
              statArrow="up"
              statPercent="12"
              statPercentColor="text-emerald-500"
              :statDescripiron=nextDataScience.wait
              statIconName="fas fa-percent"
              statIconColor="bg-emerald-500"
              statUserLink="/user"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CardStats from "@/components/Cards/CardStats.vue";

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
      wait: weeksBetween(new Date(), member.availability.from) + " weeks",
      name: member.firstname + ' ' + member.surname
    }
}

export default {
  components: {
    CardStats,
  },
  data() {

    const teams = this.$store.getters["members/getFullMembers"].reduce(function (r, a) {
        r[a.Team] = r[a.Team] || [];
        r[a.Team].push(a);
        return r;
    }, Object.create(null));

    return {
      nextDataScience: nextAvailable(teams, 'DataScience'),
      nextMiddleware: nextAvailable(teams, 'Integrations'),
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
