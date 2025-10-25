// ***********************************************************
// This example support/component.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import { mount } from 'cypress/vue'
import { createPinia, setActivePinia } from "pinia"
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@/assets/styles/index.css'

let pinia

// Run this code before each *test*.
beforeEach(() => {
  // New Pinia
  pinia = createPinia()

  // Set current Pinia instance
  setActivePinia(pinia)
})

function mountWithPinia(Comp, options = {}) {
  return mount(Comp, {
    ...options,
    global: {
      ...options?.global,
      plugins: [...(options?.global?.plugins ?? []), pinia],
    },
  })
}

Cypress.Commands.add('mount', mountWithPinia)