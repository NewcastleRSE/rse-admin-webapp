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
                // Highlight logic: Blue if invoice exists (for step 0) or if stage is marked done
                step.completed || step.active ? 'text-blue-600' : 'text-gray-300',
                // Rollback styling (Red)
                step.completed && !step.active && index !== 0 ? 'cursor-pointer hover:bg-red-50 hover:text-red-500' : '',
                // Progression styling (Blue)
                !step.completed && isNextLogicalStep(index) ? 'cursor-pointer hover:bg-blue-50 hover:text-blue-500' : '',
                (step.active || isStepDisabled(step, index)) ? 'cursor-default' : ''
              ]"
            >
              <component :is="step.icon" class="size-6 shrink-0" aria-hidden="true" />
            </button>

            <div class="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 z-10">
              <span v-if="step.completed && !step.active && index !== 0">Rollback to {{ step.name }}</span>
              <span v-else-if="!step.completed && isNextLogicalStep(index)">Mark as {{ step.name }}</span>
              <span v-else>{{ step.name }}</span>
              <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
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

// Icons
const IconCreation = h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' }, [h('path', { d: 'M12 4.5v15m7.5-7.5h-15' })]);
const IconSignature = h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' }, [h('path', { d: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10' })]);
const IconProcessing = h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' }, [h('path', { d: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99' })]);
const IconTick = h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M4.5 12.75l6 6 9-13.5' })]);

const props = defineProps({
    project: { type: Object, required: true },
    year: { type: [String, Number], required: true },
    month: { type: String, required: true },
})

const creating = ref(false)
const invoicesStore = useInvoicesStore()
const fyDates = currentFY()

const allInvoicesForFY = computed(() => invoicesStore.getByFinancialYear(fyDates.startDate.year) || [])
const currentInvoice = computed(() => allInvoicesForFY.value.find(inv => inv.project.documentId == props.project.documentId && inv.year == props.year && inv.month == props.month.toLowerCase()));

const steps = computed(() => {
  const inv = currentInvoice.value;
  return [
    // Step 0 is now 'completed' if the invoice exists in the store [cite: 40, 166]
    { name: 'Creation', icon: IconCreation, completed: !!inv, active: inv && !inv.sent_for_signature, state: null },
    { name: 'Signature', icon: IconSignature, completed: !!inv?.sent_for_signature, active: inv?.sent_for_signature && !inv.sent_to_finance, state: 'sent_for_signature' },
    { name: 'Processing', icon: IconProcessing, completed: !!inv?.sent_to_finance, active: (inv?.sent_to_finance || inv?.processed) && !inv.paid, state: 'sent_to_finance' },
    { name: 'Paid', icon: IconTick, completed: !!inv?.paid, active: !!inv?.paid, state: 'paid' }
  ];
});

const isNextLogicalStep = (index) => {
  if (index === 0) return false; 
  const prevStep = steps.value[index - 1];
  return prevStep && prevStep.completed && !steps.value[index].completed;
};

const isStepDisabled = (step, index) => {
  if (step.active) return true;
  if (index === 0) return true; 
  return !(step.completed || isNextLogicalStep(index));
};

async function onStepInteraction(step, index) {
  const invoice = currentInvoice.value;

  if (!step.completed && isNextLogicalStep(index)) {
    const stateMap = [null, 'sent_for_signature', 'sent_to_finance', 'paid'];
    await invoicesStore.updateInvoiceState(invoice, stateMap[index], true);
  } 
  else if (step.completed && !step.active) {
    if (!confirm(`Revert invoice to "${step.name}" stage?`)) return;
    const statesToReset = steps.value.slice(index + 1).map(s => s.state).filter(Boolean);
    for (const state of statesToReset) {
      // Set values to null to mark as incomplete 
      await invoicesStore.updateInvoiceState(invoice, state, false);
    }
  }
}

const regenerateDisabled = computed(() => {
    const inv = currentInvoice.value;
    return !inv || creating.value || inv.sent_for_signature || inv.sent_to_finance || inv.processed || inv.paid;
});


</script>