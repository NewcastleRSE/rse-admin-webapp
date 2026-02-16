<template>
  <button 
      v-if="invoiceAction.text !== 'N/A'"
      :disabled="invoiceAction.disabled"
      v-on:click="invoiceAction.handler ? invoiceAction.handler() : null" 
      :class="[
          'hidden rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm ring-1 ring-inset sm:block',
          // Dynamic styling based on the action status
          invoiceAction.style, 
          // Default text and ring color for action buttons
          invoiceAction.style.includes('green') ? 'text-gray-900' : 'text-gray-900 ring-gray-300 enabled:hover:bg-gray-50',
          // Disabled styling (must be applied separately for Tailwind utility classes)
          invoiceAction.disabled ? 'text-gray-300 cursor-not-allowed' : '',
      ]"
  >
      <span v-if="invoiceAction.isGenerating">{{ invoiceAction.text }}</span>
      <span v-else>{{ invoiceAction.text }}</span>
  </button>

  <!-- regenerate -->
  <button
      type="button"
      @click="createInvoice"
      :disabled="regenerateDisabled"
      :class="[
        'rounded-full p-1 shadow-sm ring-1 ring-inset transition-colors',
        regenerateDisabled 
          ? 'text-gray-300 ring-gray-200 cursor-not-allowed' 
          : 'text-gray-600 ring-gray-300 hover:bg-blue-50'
      ]"
      title="Regenerate Invoice"
    >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" :class="['size-5', invoiceAction.isGenerating ? 'animate-spin' : '']">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
</svg>

      
    </button>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useInvoicesStore } from '@/stores'
import { currentFY } from '../../utils/dates'


defineOptions({
  name: 'InvoiceActionButton'
})
const props = defineProps({
    project: {
        type: Object,
        required: true,
    },
    year: {
        type: [String, Number],
        required: true,
    },
    month: {
        type: String,
        required: true,
    },
})

// --- State and Store Initialization ---
const creating = ref(null) // Local state to manage 'Generating...' button text
const invoicesStore = useInvoicesStore()
const fyDates = currentFY()

// This ensures that when the store state changes, this property updates.
const allInvoicesForFY = computed(() => {
  return invoicesStore.getByFinancialYear(fyDates.startDate.year) || []
})



const regenerateDisabled = computed(() => {
    const inv = currentInvoice.value;
    if (!inv) return true;
    
    // Disable if generating something else, or if the invoice has been sent for signature
    return (
        creating.value !== null || 
        inv.sent_for_signature || 
        inv.sent_to_finance || 
        inv.processed || 
        inv.paid
    );
});

function getInvoice(projectId, year, month) {
  // Use the reactive array to find the invoice
  return allInvoicesForFY.value.find(invoice => 
    invoice.project.documentId == projectId && 
    invoice.year == year && 
    invoice.month == month.toLowerCase()
  )
}

const currentInvoice = computed(() => {
    return getInvoice(props.project.documentId, props.year, props.month);
});

const invoiceAction = computed(() => {
const invoice = currentInvoice.value;
    const identifier = `${props.project.documentId}-${props.project.year}-${props.project.month}`;

    // Helper to keep base styling consistent
    const baseStyle = 'bg-white ring-gray-300';
    
    // State logic
    
    // Paid 
    if (invoice && invoice.paid) {
        return {
            text: 'Paid',
            handler: null,
            style: 'bg-green-300 ring-green-60',
            disabled: true,
            isGenerating: false,
        };
    }

    // Not paid, but processed
    if (invoice && invoice.processed) {
        return {
            text: 'Mark as paid',
            handler: () => invoicesStore.updateInvoiceState(invoice, 'paid'),
            style: baseStyle,
            disabled: false,
            isGenerating: false,
        };
    }
    
    // Not processed but sent to finance
    if (invoice && invoice.sent_to_finance) {
        return {
            text: 'Mark as processed',
            handler: () => invoicesStore.updateInvoiceState(invoice, 'processed'),
            style: baseStyle,
            disabled: false,
            isGenerating: false,
        };
    }
    
    // Not sent to finance but sent for signature
    if (invoice && invoice.sent_for_signature) {
        return {
            text: 'Signed - Mark as sent to finance',
            handler: () => invoicesStore.updateInvoiceState(invoice, 'sent_to_finance'),
            style: baseStyle,
            disabled: false,
            isGenerating: false,
        };
    }

    // Invoice has been generated, but not sent for signature
    if (invoice) {
        return {
            text: 'Mark as sent for signature',
            handler: () => invoicesStore.updateInvoiceState(invoice, 'sent_for_signature'),
            style: baseStyle,
            disabled: false,
            isGenerating: false,
        };
    }

    // todo add regenerate button here

    // No invoice exists, but there is an account code
    // todo add in other checks here - there are days clcoked for the month and any other info that is required
    if (!invoice && props.project.account) {
         const isCurrentlyGenerating = creating.value === `${props.project.documentId}-${props.year}-${props.month}`;
        
         return {
            text: isCurrentlyGenerating ? 'Generating...' : 'Generate Invoice',
            handler: () => createInvoice(),
            isGenerating: isCurrentlyGenerating,
            style: baseStyle,
            disabled: creating.value !== null || !props.project.account,
        };
    }

      // Not able to generate invoice, missing details
      // todo add other details
    if (!props.project.account) {
        return {
            text: 'Generate Invoice',
            handler: null,
            style: 'bg-gray-100 ring-gray-300 text-gray-300 cursor-not-allowed',
            disabled: true,
            isGenerating: false,
        };
    }

    // Fallback
    return {
        text: 'N/A', 
        handler: null, 
        style: 'bg-gray-100 ring-gray-300', 
        disabled: true,
        isGenerating: false,
    };
});

function createInvoice() {
  creating.value = `${props.project.documentId}-${props.year}-${props.month}`
  invoicesStore.createInvoice(props.project.documentId, props.year, props.month).then(() => creating.value = null)
}


</script>

