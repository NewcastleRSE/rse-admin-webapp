import Timeline from '../../src/components/Assignments/Timeline.vue'

describe('Timeline.vue', {viewportHeight: 900, viewportWidth: 1440}, () => {
  it('mounts', () => {
    cy.mount(Timeline, {
      props: {
        rses: [
          { documentId: 1, firstname: 'John', lastname: 'Doe', photo: 'john-doe.jpg', contractStart: '2023-01-01', nextAvailableDate: '2023-01-02' }
        ],
        projects: [
          { documentId: 1, name: 'Project Alpha', costModel: 'Directly Incurred', rse: { documentId: 1 } }
        ],
        assignments: [
          { documentId: 1, rse: { documentId: 1 }, project: { documentId: 1 }, start: '2023-01-10', end: '2023-02-10', capacity: 20 }
        ]
      }
    })
  })
})