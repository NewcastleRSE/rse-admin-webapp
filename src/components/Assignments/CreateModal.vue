<template>
    <div v-if="showModal" tabindex="-1" class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full h-screen md:inset-0 h-modal md:h-full">
        <div class="flex flex-col justify-center relative p-4 w-full md:max-w-lg lg:max-w-4xl h-full mx-auto">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <!-- Modal header -->
                <div class="flex justify-between items-center p-5 rounded-t border-b dark:border-gray-600">
                    <h3 class="text-xl font-medium text-gray-900 dark:text-white">
                        Create Assignment
                    </h3>
                    <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" v-on:click="toggleModal()">
                        <i class="fa-solid fa-xmark"></i>
                        <span class="sr-only">Close modal</span> 
                    </button>
                </div>
                <!-- Modal body -->
                <div class="p-6 space-y-6">
                    <div class="relative flex w-full flex-wrap items-stretch mb-3">
                      <span class="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                        <i class="fas fa-user"></i>
                      </span>
                      <vue3-simple-typeahead placeholder="RSE" v-model="rse" :defaultItem=rse :items=rses :minInputLength="1" :itemProjection="rseProjection" @selectItem="selectRse">
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
                      <vue3-simple-typeahead placeholder="Project" v-model="project" :defaultItem=project :items=projects :minInputLength="1" :itemProjection="projectProjection" @selectItem="selectProject">
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
                      <VueDatePicker v-model="dateRange" range :enableTimePicker="false" inputClassName="py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full pl-10" />
                    </div>
                    <div class="relative flex w-full flex-wrap items-stretch mb-3">
                      <span class="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                        <i class="fas fa-percentage"></i>
                      </span>
                      <input v-model="split" type="number" min="0" max="100" step="1" placeholder="Split" class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full pl-10"/>
                    </div>
                </div>
                <!-- Modal footer -->
                <div class="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                    <button v-on:click="toggleModal()" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Cancel</button>
                    <button v-on:click="addAssignment()" type="button" class="text-white bg-emerald-500 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create</button>
                </div>
            </div>
        </div>
    </div>
    <div v-if="showModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export default {
  name: "Create",
  data() {
    return {
      showModal: false,
      rseProjection: (item) => {
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
      rse: null,
      selectRse: (rse) => {
        this.rse = rse
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
    VueDatePicker
  },
  computed: {
    rses() {
      return this.$store.state.rses.rses
    },
    projects() {
      return this.$store.state.projects.projects
    }
  },
  mounted() {
    this.importAvatars(require.context('@/assets/img/avatars/', true, /\.(gif|jpe?g|tiff?|png|webp|bmp)$/));
  },
  methods: {
    toggleModal: function(rseID, projectID, range, split){

      if(rseID) this.selectRse(this.$store.getters["rses/getRseByID"](rseID))
      if(projectID) this.selectProject(this.$store.getters["projects/getProject"](projectID))

      this.dateRange = range && range.length ? range : null
      this.split = split ? split : null

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
        id: Math.max(...this.$store.getters["assignments/getAssignments"]) + 1,
        rse: this.rse,
        project: this.project,
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