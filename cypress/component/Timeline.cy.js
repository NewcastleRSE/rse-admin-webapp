import Timeline from '../../src/components/Assignments/Timeline.vue'
import Assignments from '../../src/views/Assignments.vue'

import RSEsData from '../fixtures/rses.json'
import AssignmentsData from '../fixtures/assignments.json'

describe('Timeline.vue', {viewportHeight: 900, viewportWidth: 1440}, () => {
  // it('mounts', () => {
  //   cy.mount(Timeline, {
  //     props: {
  //       rses: RSEs,
  //       projects: [
  //         { documentId: 1, name: 'Project Alpha', costModel: 'Directly Incurred', rse: { documentId: 1 } }
  //       ],
  //       assignments: Assignments
  //     }
  //   })
  // })

  it('mounts', () => {
    cy.mount(Assignments)
  })
})