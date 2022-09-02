<template>
    <div v-if="showModal" tabindex="-1" class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full h-screen md:inset-0 h-modal md:h-full">
        <div class="flex flex-col justify-center relative p-4 w-full md:max-w-lg lg:max-w-4xl h-full mx-auto">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <!-- Modal header -->
                <div class="flex justify-between items-center p-5 rounded-t border-b dark:border-gray-600">
                    <h3 class="text-xl font-medium text-gray-900 dark:text-white">
                        Unallocated Assignments
                    </h3>
                    <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" v-on:click="toggleModal()">
                        <i class="fa-solid fa-xmark"></i>
                        <span class="sr-only">Close modal</span> 
                    </button>
                </div>
                <!-- Modal body -->
                <div class="p-6 space-y-6 overflow-y-scroll max-h-96">
                    <div v-for="project in projects" :key="project.id">
                      <p class="text-lg font-bold">{{project.dealname}}</p>
                      <p class="text-sm mb-4">{{project.contacts[0].firstname}} {{project.contacts[0].lastname}} - {{project.school}}</p>
                    </div>
                </div>
                <!-- Modal footer -->
                <div class="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                    <button v-on:click="toggleModal()" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Close</button>
                </div>
            </div>
        </div>
    </div>
    <div v-if="showModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
</template>

<script>

export default {
  name: "Unallocated",
  data() {
    return {
      showModal: false,
      projects: []
    }
  },
  methods: {
    toggleModal: function(projectIDs){
      this.projects = this.$store.getters["projects/getProjects"](projectIDs)
      this.showModal = !this.showModal;
    },
  }
}
</script>