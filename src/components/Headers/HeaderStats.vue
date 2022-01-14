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
              :statTitle=nextMiddleware.availability.from.toLocaleDateString()
              statArrow="up"
              statPercent="3.48"
              statPercentColor="text-emerald-500"
              statDescripiron="26 Week Wait"
              statIconName="far fa-chart-bar"
              statIconColor="bg-red-500"
              statUserLink="/user"
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
            <card-stats
              statSubtitle="MIDDLEWARE"
              :statTitle=nextMiddleware.availability.from.toLocaleDateString()
              statArrow="down"
              statPercent="3.48"
              statPercentColor="text-red-500"
              statDescripiron="26 Week Wait"
              statIconName="fas fa-chart-pie"
              statIconColor="bg-orange-500"
              statUserLink="/user"
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
            <card-stats
              statSubtitle="WEB &amp; MOBILE"
              :statTitle=nextWebMobile.availability.from.toLocaleDateString()
              statArrow="down"
              statPercent="1.10"
              statPercentColor="text-orange-500"
              statDescripiron="26 Week Wait"
              statIconName="fas fa-users"
              statIconColor="bg-pink-500"
              statUserlink="/user"
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
            <card-stats
              statSubtitle="DATA SCIENCE"
              :statTitle=nextDataScience.availability.from.toLocaleDateString()
              statArrow="up"
              statPercent="12"
              statPercentColor="text-emerald-500"
              statDescripiron="26 Week Wait"
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
    return teams[teamName].filter( e => {
        return new Date(e.availability.from).getTime() === mostRecentDate.getTime();
    })[0];
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
      nextWebMobile: nextAvailable(teams, 'WebMobile')
    };
  },
};
</script>
