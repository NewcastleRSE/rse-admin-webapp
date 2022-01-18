<template>
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="px-4 mx-auto flex flex-wrap items-center justify-between">
        <div class="max-w-full flex-grow flex-1 w-full relative flex justify-between lg:w-auto pr-4 lg:static lg:block lg:justify-start">
          <h3 class="font-semibold text-lg text-blueGray-700">
            Project Assignments
          </h3>
          <button class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none" type="button">
            <span class="block relative w-6 h-px rounded-sm bg-white"></span>
            <span class="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
            <span class="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
          </button>
        </div>
        <div class="flex lg:flex-grow items-center">
          <ul class="flex flex-col lg:flex-row list-none ml-auto">
            <li class="nav-item">
              <button class="px-3 flex h-full inline-block align-middle items-center text-sm uppercase font-bold leading-snug hover:opacity-75" v-on:click="zoom(0)">
                3m
              </button>
            </li>
            <li class="nav-item">
              <button class="px-3 flex h-full inline-block align-middle items-center text-sm uppercase font-bold leading-snug hover:opacity-75" v-on:click="zoom(1)">
                6m
              </button>
            </li>
            <li class="nav-item">
              <button class="px-3 flex h-full inline-block align-middle items-center text-sm uppercase font-bold leading-snug hover:opacity-75" v-on:click="zoom(2)">
                12m
              </button>
            </li>
            <li class="nav-item">
              <button class="px-3 flex h-full inline-block align-middle items-center text-sm uppercase font-bold leading-snug hover:opacity-75" v-on:click="zoom(3)">
                All
              </button>
            </li>
            <li class="nav-item">
              <button class="px-3 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75" v-on:click="create()">
                <i class="fas fa-plus text-lg leading-lg opacity-75 text-blueGray-700"></i>
              </button>
            </li>
            <li class="nav-item">
              <button class="px-3 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75" v-bind:class="{ 'cursor-not-allowed': !edited }" v-on:click="edited? save() : null">
                <i class="fas fa-save text-lg leading-lg opacity-75" v-bind:class="{ 'text-blueGray-700': edited, 'text-blueGray-300': !edited }"></i>
              </button>
            </li>
            <li class="nav-item">
              <button class="px-3 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75 text-blueGray-700" v-bind:class="{ 'cursor-not-allowed': !edited }" v-on:click="edited? cancel() : null">
                <i class="fas fa-undo text-lg leading-lg opacity-75" v-bind:class="{ 'text-blueGray-700': edited, 'text-blueGray-300': !edited }"></i>
              </button>
            </li>
            <li class="nav-item">
              <button class="px-3 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75" v-on:click="remove()">
                <i class="fas fa-trash-alt text-lg leading-lg opacity-75 text-blueGray-700"></i>
              </button>
            </li>
            <li class="nav-item">
              <button class="px-3 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75" v-on:click="exportCSV()">
                <i class="fas fa-download text-lg leading-lg opacity-75 text-blueGray-700"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  props: {
    edited: { type: Boolean },
    zoom: { type: Function },
    create: { type: Function },
    save: { type: Function },
    cancel: { type: Function },
    remove: { type: Function },
    export: { type: Function },
  }
}
</script>
