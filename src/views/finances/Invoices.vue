<template>
  <div class="w-full mb-12 px-4">
    <div class="relative flex flex-col min-w-0 break-words w-full mb-6 px-4 py-12 shadow-lg rounded bg-white">
      <div class="mx-auto w-full">
        <div class="mx-auto divide-y divide-gray-900/10">
          <h2 class="text-2xl font-bold leading-10 tracking-tight text-gray-900">{{ yearTitle }} Invoices</h2>
          <dl class="mt-10 space-y-6 divide-y divide-gray-900/10">
            <Disclosure as="div" v-for="(month, index) in months" :key="month.name" class="pt-6" v-slot="{ open }">
              <dt>
                <DisclosureButton class="flex w-full items-start justify-between text-left text-gray-900">
                  <div>
                    <span class="text-base font-semibold leading-7">{{ month.name }} {{ month.year }}</span>
                    <span v-if="month.total && index > 0" class="inline-flex items-center rounded-md bg-red-100 ml-4 px-2 py-1 text-xs font-medium text-red-700">{{ month.total }} Due</span>
                    <span v-if="month.sent && index > 0" class="inline-flex items-center rounded-md bg-yellow-100 ml-4 px-2 py-1 text-xs font-medium text-yellow-800">{{ month.sent }} Sent</span>
                    <span v-if="month.processed && index > 0" class="inline-flex items-center rounded-md bg-blue-100 ml-4 px-2 py-1 text-xs font-medium text-blue-700">{{ month.processed }} Processed</span>
                    <span v-if="month.paid && index > 0" class="inline-flex items-center rounded-md bg-green-100 ml-4 px-2 py-1 text-xs font-medium text-green-700">{{ month.paid }} Paid</span>
                  </div>
                  <span class="ml-6 flex h-7 items-center">
                    <ChevronRightIcon v-if="!open" class="h-6 w-6" aria-hidden="true" />
                    <ChevronDownIcon v-else class="h-6 w-6" aria-hidden="true" />
                  </span>
                </DisclosureButton>
              </dt>
              <DisclosurePanel as="dd" class="mt-2 pr-12">
               <ul role="list" class="divide-y divide-gray-100">
        <li v-for="project in month.projects" :key="project.documentId" class="flex items-center justify-between gap-x-6 py-5">
            <div class="min-w-0">
                <div class="flex items-start gap-x-3">
                    <p class="text-sm font-semibold leading-6 text-gray-900">{{ project.name }}</p>
                    
                    <!-- Simplified Status Badges (kept inline as per your original structure) -->
                    <p v-if="hasState(getInvoice(project.documentId, month.year, month.name), 'transaction')" :class="[statuses['paid'], 'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset']">Paid {{ getInvoice(project.documentId, month.year, month.name).transaction.postedDate }}</p>
                    <p v-else-if="hasState(getInvoice(project.documentId, month.year, month.name), 'processed')" :class="[statuses['processed'], 'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset']">Processed {{ getInvoice(project.documentId, month.year, month.name).processed }}</p>
                    <p v-else-if="hasState(getInvoice(project.documentId, month.year, month.name), 'sent')" :class="[statuses['sent'], 'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset']">Sent {{ getInvoice(project.documentId, month.year, month.name).sent }}</p>
                    <!-- todo sent to finance/ sent for signature -->
                </div>
                <div class="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                    <p v-if="project.contacts" class="whitespace-nowrap">
                        {{ project.contacts[0].firstname }} {{ project.contacts[0].lastname}}
                    </p>
                    <svg viewBox="0 0 2 2" class="h-0.5 w-0.5 fill-current">
                        <circle cx="1" cy="1" r="1" />
                    </svg>
                    <p class="truncate">{{ project.school }}</p>
                    <p class="truncate">Month: {{ month.name || 'Not Set' }}</p>

                </div>
            </div>
            <div class="flex flex-none items-center gap-x-4">
                <InvoiceActionButton
                    :project="project"
                    :year="month.year"
                    :month="month.name"
                   
                />
            </div>
        </li>
    </ul> 
              </DisclosurePanel>
            </Disclosure>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { currentFY } from '../../utils/dates'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
import { useAssignmentsStore, useInvoicesStore, useProjectsStore } from '@/stores'
import InvoiceActionButton from '@/components/Finance/InvoiceActionButton.vue'


const assignmentsStore = useAssignmentsStore(),
      invoicesStore = useInvoicesStore(),
      projectsStore = useProjectsStore()

const fyDates = currentFY()
const yearTitle = `${fyDates.startDate.toFormat('yyyy')}/${fyDates.endDate.toFormat('yy')}`

const invoices = invoicesStore.getByFinancialYear(fyDates.startDate.year)

const monthsToDate = Math.floor(fyDates.currentDate.diff(fyDates.startDate, ['months']).months)

const months = []
const creating = ref(null)

for (let i = 0; i <= monthsToDate; i++) {

  const assignments = assignmentsStore.getByPeriod(fyDates.startDate.toISODate(), fyDates.startDate.endOf('month').minus({days: 1}))
  const projectIDs = assignments.reduce(function (IDs, assignment) { return [...IDs, assignment.project.documentId] }, [])
  const projects = projectsStore.filterByIDs([...new Set(projectIDs)]).filter(project => project.costModel === 'Facility')

  for (let y = 0; y < projects.length; y++) {
    projects[y].invoice = invoices.find(invoice => invoice.project.documentId == projects[y].documentId && invoice.year == fyDates.startDate.year && invoice.month == fyDates.startDate.monthLong.toLowerCase())
  }

  const monthlyInvoices = invoices.filter(invoice => invoice.month === fyDates.startDate.monthLong.toLowerCase())

  months.push({
    name: fyDates.startDate.monthLong,
    year: fyDates.startDate.year,
    total: projects.length - monthlyInvoices.filter(invoice => invoice.sent).length,
    sent: monthlyInvoices.filter(invoice => invoice.sent && !invoice.processed).length,
    processed: monthlyInvoices.filter(invoice => invoice.processed && !invoice.transaction).length,
    paid: monthlyInvoices.filter(invoice => invoice.transaction).length,
    projects: projects
  })

  fyDates.startDate = fyDates.startDate.plus({ month: 1 })
}

months.reverse()

function getInvoice(projectId, year, month) {
  return invoices.find(invoice => invoice.project.documentId == projectId && invoice.year == year && invoice.month == month.toLowerCase())
}



function hasState(invoice, state) {
  return invoice && invoice[state]
}

const statuses = {
  sent: 'text-yellow-700 bg-yellow-50 ring-yellow-600/20',
  processed: 'text-blue-600 bg-blue-50 ring-blue-500/10',
  paid: 'text-green-700 bg-green-50 ring-green-600/20',
}

</script>