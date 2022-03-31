<template>
    <div v-if="showModal" class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
      <div class="relative w-auto my-6 mx-auto max-w-3xl">
        <!--content-->
        <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <!--header-->
          <div class="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
            <h3 class="text-3xl font-semibold">
              Create Assignment
            </h3>
            <button class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none" v-on:click="toggleModal()">
              <span class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                ×
              </span>
            </button>
          </div>
          <!--body-->
          <div class="relative p-6 flex-auto">
            <div class="relative flex w-full flex-wrap items-stretch mb-3">
              <span class="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                <i class="fas fa-user"></i>
              </span>
              <vue3-simple-typeahead placeholder="RSE" v-model="member" :items=members :minInputLength="1" :itemProjection="memberProjection" @selectItem="selectMember">
              <template #list-item-text="slot">
                <div class="align-middle whitespace-nowrap">
                  <div class="flex items-center">
                    <img :src="getAvatar(slot.itemProjection(slot.item))" class="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow mr-2" />
                    <span v-html="slot.boldMatchText(slot.itemProjection(slot.item))"></span>
                  </div>
                </div>
              </template>
              </vue3-simple-typeahead>
            </div>
            <div class="relative flex w-full flex-wrap items-stretch mb-3">
              <span class="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                <i class="fas fa-briefcase"></i>
              </span>
              <vue3-simple-typeahead placeholder="Project" v-model="project" :items=projects :minInputLength="1" :itemProjection="projectProjection" @selectItem="selectProject">
              <template #list-item-text="slot">
                <div class="align-middle whitespace-nowrap">
                  <div class="flex items-center">
                    <span v-html="slot.boldMatchText(slot.itemProjection(slot.item))"></span>
                  </div>
                </div>
              </template>
              </vue3-simple-typeahead>
            </div>
            <div class="relative flex w-full flex-wrap items-stretch mb-3">
              <Datepicker v-model="dateRange" range :enableTimePicker="false" inputClassName="py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full pl-10" />
            </div>
            <div class="relative flex w-full flex-wrap items-stretch mb-3">
              <span class="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                <i class="fas fa-percentage"></i>
              </span>
              <input v-model="split" type="number" min="0" max="100" step="1" placeholder="Split" class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full pl-10"/>
            </div>
          </div>
          <!--footer-->
          <div class="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
            <button class="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" v-on:click="toggleModal()">
              Close
            </button>
            <button class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" v-on:click="addAssignment()">
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
</template>

<script>
import Datepicker from 'vue3-date-time-picker';
import 'vue3-date-time-picker/dist/main.css'

export default {
  name: "Create",
  data() {
    return {
      showModal: false,
      memberProjection: (item) => {
        return item.firstname + " " + item.lastname
      },
      projectProjection: (item) => {
        return item.dealname
      },
      avatars: [],
      getAvatar: (rse) => {
          let avatar = this.avatars.find((avatar) => {
            return avatar.name === rse.toLowerCase()
          })
          return avatar ? avatar.pathLong : '' 
      },
      member: null,
      selectMember: (member) => {
        this.member = member
      },
      project: null,
      selectProject: (project) => {
        this.project = project
      },
      dateRange: null,
      split: 50
    }
  },
  components: {
    Datepicker
  },
  computed: {
    members() {
      return this.$store.state.members.members
    },
    projects() {
      return this.$store.state.projects.projects
    }
  },
  mounted() {
    this.importAvatars(require.context('@/assets/img/avatars/', true, /\.(gif|jpe?g|tiff?|png|webp|bmp)$/));
  },
  methods: {
    toggleModal: function(){
      this.showModal = !this.showModal;
    },
    importAvatars(r) {
      r.keys().forEach(key => (this.avatars.push({ pathLong: r(key), pathShort: key, name: (key.substring(2)).split('.')[0].split('-').join(' ') })));
    },
    /*
    id that is set here does not set the assignment id in strapi,
    id is needed for assignment to be draggable in gantt,
    
    Changes assignment format to match chart so save
    can see the differences between saved items and 
    items in the chart
    */
    addAssignment() {

      const assignment = {
        id: this.$store.getters["assignments/getUID"],
        member: this.member,
        projectID: this.project.id,
        startDate: new Date(this.dateRange[0]).toISOString(),
        endDate: new Date(this.dateRange[1]).toISOString(),
        FTE: this.split
      };

      this.$parent.addAssignment(assignment);
      this.toggleModal();
    },
  }
}
</script>