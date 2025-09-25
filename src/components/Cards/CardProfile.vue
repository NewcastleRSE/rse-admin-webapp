<template>
  <div
    class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16"
  >
    <div class="px-6">
      <div class="flex flex-wrap justify-center">
        <div class="w-full px-4 flex justify-center">
          <div class="relative">
            <img
              alt="..."
              :src="getAvatar(rse)"
              class="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
            />
          </div>
        </div>
        <div class="w-full px-4 text-center mt-20">
          
        </div>
      </div>
      <div class="text-center mt-12">
        <h3
          class="text-xl font-semibold leading-normal mb-2 text-slate-700 mb-2"
        >
          {{rse.firstname}} {{rse.lastname}}
        </h3>
        <div
          class="text-sm leading-normal mt-0 mb-2 text-slate-400 font-bold uppercase"
        >
          {{rse.team}}
        </div>
      </div>
      <div class="flex flex-row justify-center py-4 lg:pt-4 pt-8">
            <div class="flex flex-col p-3 text-center">
              <span
                class="text-2xl font-bold block uppercase tracking-wide text-slate-600"
              >
                <i class="fa-solid fa-envelope-open-text"></i>
              </span>
              <span class="text-lg text-slate-600">Email</span>
            </div>
            <div class="flex flex-col p-3 text-center">
              <span
                class="text-2xl font-bold block uppercase tracking-wide text-slate-600"
              >
                <i class="fa-brands fa-slack"></i>
              </span>
              <span class="text-lg text-slate-600">Slack</span>
            </div>
            <div class="flex flex-col p-3 text-center">
              <span
                class="text-2xl font-bold block uppercase tracking-wide text-slate-600"
              >
                <i class="fa-brands fa-github"></i>
              </span>
              <span class="text-lg text-slate-600">GitHub</span>
            </div>
          </div>
      <div class="mt-10 py-10 border-t border-slate-200 text-center">
        <div class="flex flex-wrap justify-center">
          <div class="w-full lg:w-9/12 px-4">
            <dl class="text-left">
                <dt class="font-bold">Next Available</dt>
                <dd class="mb-4">{{formatDate(rse.nextAvailableDate, 'LLLL yyyy')}}</dd>

                <dt class="font-bold">Next Available FTE</dt>
                <dd class="mb-4">{{rse.nextAvailableFTE}}%</dd>

                <dt class="font-bold">Contract Start</dt>
                <dd class="mb-4">{{formatDate(rse.contractStart, 'dd LLLL yyyy')}}</dd>

                <dt class="font-bold">Contract End</dt>
                <dd class="mb-4">{{formatDate(rse.contractEnd, 'dd LLLL yyyy')}}</dd>

                <dt class="font-bold">Personnel Number</dt>
                <dd class="mb-4">{{rse.personnelNumber}}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { DateTime } from 'luxon'

export default {
  data() {
    return {
      avatars: [],
      getAvatar: (rse) => {
          let name = rse.firstname + ' ' + rse.lastname
          let avatar = this.avatars.find((avatar) => {
            return avatar.name === name.toLowerCase()
          })
          return new URL(`${avatar.pathLong}`, import.meta.url)
      }
    };
  },
  beforeMount() {
    this.importAvatars(import.meta.glob('@/assets/img/avatars/*.*'))
  },
  computed: {
    rse() {
      return this.$store.getters["rses/getRse"](this.$route.params.name)
    }  
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
    formatDate(date, format) {
      return DateTime.fromISO(date).toFormat(format)
    }
  }
};
</script>
