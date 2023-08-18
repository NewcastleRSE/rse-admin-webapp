<template>
    <div class="w-full mb-12">
        <div class="relative flex flex-col min-w-0 break-words w-full mb-6 p-4 shadow-lg rounded bg-white">
            <div class="flex flex-wrap items-center">
                <div class="relative w-full max-w-full flex-grow flex-1">
                    <h6 class="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
                        SAP Report
                    </h6>
                    <h2 class="text-blueGray-700 text-xl font-semibold">
                        Upload
                    </h2>
                </div>
            </div>
            <form class="col-span-full" v-on:submit="uploadFile">
                <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div class="text-center">
                        <TableCellsIcon class="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                        <div v-if="showFileSelect === true">
                            <div class="mt-4 flex text leading-6 text-gray-600">
                                <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-semibold text-cyan-600 hover:text-cyan-500">
                                    <span>Upload a file</span>
                                    <input ref="fileInput" v-on:change="selectFile" id="file-upload" name="file-upload" type="file" class="sr-only" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
                                </label>
                                <p class="pl-1">or drag and drop</p>
                            </div>
                            <p class="pt-4 text-sm leading-5 text-gray-600">XLXS up to 25MB</p>
                        </div>
                        <div v-else>
                            <p>Are you sure you wish to upload {{ filename }}?</p>
                            <div class="mt-6 flex items-center justify-center gap-x-6">
                                <button type="button" class="leading-6 text-gray-900" v-on:click="clearForm()">Cancel</button>
                                <button type="submit" class="rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600">Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { uploadTransactions } from '../../utils/orm'
import { TableCellsIcon } from '@heroicons/vue/24/solid'

const fileInput = ref(null)

let file = null
let filename = ref('')
let showFileSelect = ref(true)

const selectFile = () => {
    if(fileInput.value.files) {
        file = fileInput.value.files[0]
        filename.value = fileInput.value.files[0].name
        showFileSelect.value = false
    }
    else {
        clearForm()
    }
}

const uploadFile = async (event) => {
    event.preventDefault()

    const formData = new FormData()
    formData.append('files.file', file, file.name)

    await uploadTransactions(formData)

    clearForm()
}

const clearForm = () => {
    showFileSelect.value = true
    file.value = null
}

</script>