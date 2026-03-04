To handle both the initial Create and the Regenerate scenarios, we can leverage the isOpen state. Since your logic for index 0 already handles both "Create" (if no invoice) and "Regenerate" (if invoice exists), we simply need to ensure the icon and hover logic reflect that state change.

I have updated the IconClose definition and refined the template logic to ensure that whenever the menu is active, the icon is a cross with the blue hover effect.

Code snippet
<template>
  <div class="flex items-center space-x-4">
    <nav class="flex" aria-label="Progress">
      <ol role="list" class="flex items-center space-x-2 md:space-x-4">
        <li v-for="(step, index) in steps" :key="step.name" class="flex items-center">
          
          <div class="group relative flex items-center">
            <button 
              @click="onStepInteraction(step, index)"
              :disabled="isStepDisabled(step, index)"
              :class="[
                'flex items-center justify-center p-1 rounded-full transition-all duration-200',
                // menu open for create step
                index === 0 && isOpen ? ' text-red-600' : '',
                // completed steps that are not active
                step.completed && !step.active ? 'text-green-600' : 'text-gray-400',
                // active step
                !step.completed && isNextLogicalStep(index) ? 'hover:bg-blue-50 hover:text-blue-500' : '',
                step.active ? 'text-blue-600' : '',
                // cursor for clickable steps
                (index === 0 || step.active || !isStepDisabled(step, index)) ? 'cursor-pointer' : ''
              ]"
            >
              <svg v-if="index === 0 && creating" class="size-6 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              
              <component 
                v-else 
                :is="(index === 0 && isOpen) ? IconClose : step.icon" 
                class="size-6 shrink-0" 
                aria-hidden="true" 
              />
            </button>

            <div class="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 z-10">
              <span v-if="index === 0 && isOpen">Close Menu</span>
              <span v-else-if="step.completed && !step.active && index !== 0">Rollback to {{ step.name }}</span>
              <span v-else-if="step.completed && !step.active && index === 0">Regenerate Invoice</span>
              <span v-else-if="!step.completed && step.active && index === 0">Create Invoice</span>
              <span v-else-if="!step.completed && isNextLogicalStep(index)">Mark as {{ step.name }}</span>
              <span v-else>{{ step.name }}</span>
              <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div 
                v-if="index === 0 && isOpen && !creating" 
                class="absolute left-0 top-full mt-2 w-32 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 py-1 text-gray-700 z-50"
              >
                <button @click="createInvoice(true)" class="flex w-full items-center px-3 py-1.5 text-xs hover:bg-blue-50 hover:text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-2 size-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                  Editable
                </button>
                <button @click="createInvoice(false)" class="flex w-full items-center px-3 py-1.5 text-xs hover:bg-blue-50 hover:text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-2 size-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                  Readonly
                </button>
              </div>
            </transition>
          </div>

          <svg v-if="index !== steps.length - 1" class="ml-2 size-5 shrink-0 text-gray-300 md:ml-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
          </svg>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup>
import { computed, h, ref } from 'vue';
import { useInvoicesStore } from '@/stores'
import { currentFY } from '../../utils/dates'
import UploadInvoicePDF from '@/components/Finance/UploadInvoicePDF.vue'

// Icons
const IconCreation = h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' }, [h('path', { d: 'M12 4.5v15m7.5-7.5h-15' })]);
const IconSignature = h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' }, [h('path', { d: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10' })]);
const IconProcessing = h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' }, [h('path', { d: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99' })]);
const IconTick = h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M4.5 12.75l6 6 9-13.5' })]);
const IconClose = h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M6 18L18 6M6 6l12 12' })]);

const props = defineProps({
    project: { type: Object, required: true },
    year: { type: [String, Number], required: true },
    month: { type: String, required: true },
})

const isOpen = ref(false)
const creating = ref(false)
const invoicesStore = useInvoicesStore()
const fyDates = currentFY()

const allInvoicesForFY = computed(() => invoicesStore.getByFinancialYear(fyDates.startDate.year) || [])
const currentInvoice = computed(() => allInvoicesForFY.value.find(inv => inv.project.documentId == props.project.documentId && inv.year == props.year && inv.month == props.month.toLowerCase()));

const steps = computed(() => {
  const inv = currentInvoice.value;
  return [
    { name: 'Create', icon: IconCreation, completed: !!inv, active: !inv, state: null },
    { name: 'Signed', icon: IconSignature, completed: !!inv?.sent_for_signature, active: !!inv && !inv?.sent_for_signature, state: 'sent_for_signature' },
    { name: 'Sent to Finance', icon: IconProcessing, completed: !!inv?.sent_to_finance, active: !!inv?.sent_for_signature && !inv?.sent_to_finance, state: 'sent_to_finance' },
    { name: 'Paid', icon: IconTick, completed: !!inv?.paid, active: !!inv?.processed && !inv?.paid, state: 'paid' }
  ];
});

const isNextLogicalStep = (index) => {
  if (index === 0) return true; // First step is always available if not completed
  const prevStep = steps.value[index - 1];
  return prevStep && prevStep.completed && !steps.value[index].completed;
};

const isStepDisabled = (step, index) => {
  if (creating.value) return true; // Disable all interactions while creating
  if (index === 0) return false;   // Create step is always clickable to open menu/recreate
  return !(step.completed || isNextLogicalStep(index));
};

async function createInvoice(editable) {
  creating.value = true;
  isOpen.value = false;
  
  try {
    // If invoice exists, reset progress as per your original logic
    if (currentInvoice.value) {
      const statesToReset = steps.value.slice(1).map(s => s.state).filter(Boolean);
      for (const state of statesToReset) {
        await invoicesStore.updateInvoiceState(currentInvoice.value, state, false);
      }
    }
    
    await invoicesStore.createInvoice(props.project.documentId, props.year, props.month, editable);
  } finally {
    creating.value = false;
  }
}

async function onStepInteraction(step, index) {
  // if first step and mnenu is already open then close it
  if (index === 0 && isOpen.value) {
    isOpen.value = false;
    return;
  }
  else if (index === 0) {
    if (currentInvoice.value) {
      if (!confirm('Invoice already exists. Do you want to recreate it? This will reset all progress on the invoice.')) return;
    }
    isOpen.value = !isOpen.value;
    return;
  }

  const invoice = currentInvoice.value;
  if (!step.completed && isNextLogicalStep(index)) {
    const stateMap = [null, 'sent_for_signature', 'sent_to_finance', 'paid'];
    await invoicesStore.updateInvoiceState(invoice, stateMap[index], true);
  } 
  else if (step.completed && !step.active) {
    if (!confirm(`Revert invoice to "${step.name}" stage?`)) return;
    const statesToReset = steps.value.slice(index + 1).map(s => s.state).filter(Boolean);
    for (const state of statesToReset) {
      await invoicesStore.updateInvoiceState(invoice, state, false);
    }
  }
}
</script>