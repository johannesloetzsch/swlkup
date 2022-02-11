describe('Test filters on a LookupResult for a token', () => {
  it('Language filters', () => {
    cy.visit('/token/T0p53cret?lng=en')
    cy.log('Default: No filter')
    cy.get('main').contains('2 Supervisors are matching these filters')

    cy.log('Filter: en only')
    cy.get('#en').check({force: true})
    cy.get('main').contains('1 Supervisor matches these filters')
    cy.get('main').contains('Max Müller')

    cy.log('Filter: en or it')
    cy.get('#it').check({force: true})
    cy.get('main').contains('2 Supervisors are matching these filters')

    cy.log('Filter: it only')
    cy.get('#en').uncheck({force: true})
    cy.get('main').contains('1 Supervisor matches these filters')
    cy.get('main').contains('Maria Musterfrau')

    cy.log('No filter')
    cy.get('#it').uncheck({force: true})
    cy.get('main').contains('2 Supervisors are matching these filters')
  })

  it('Offer filters', () => {
    cy.visit('/token/T0p53cret')
    cy.log('Default: No filter on offers and show filters for offers for individuals only')
    cy.get('main').contains('2 Supervisors are matching these filters')
    cy.get('input[name=offer]').should('have.length', 4)

    cy.log('The same as the default')
    cy.get('#individual').check({force: true})
    cy.get('main').contains('2 Supervisors are matching these filters')
    cy.get('input[name=offer]').should('have.length', 4)

    cy.log('No filter on offers and show filters for offers for individuals and groups')
    cy.get('#group').check({force: true})
    cy.get('main').contains('2 Supervisors are matching these filters')
    cy.get('input[name=offer]').should('have.length', 10)

    cy.log('No filter on offers and show filters for offers for groups only')
    cy.get('#individual').uncheck({force: true})
    cy.get('main').contains('2 Supervisors are matching these filters')
    cy.get('input[name=offer]').should('have.length', 6)

    cy.log('Filter: moderation only')
    cy.get('#moderation').check({force: true})
    cy.get('main').contains('1 Supervisor matches these filters')

    cy.log('Changing the target will reset the filter')
    cy.get('#group').uncheck({force: true})
    cy.get('main').contains('2 Supervisors are matching these filters')
  })

  it('Contact filters', () => {
    cy.visit('/token/T0p53cret')
    cy.log('Default: inperson is unchecked')
    cy.get('#zip').should('not.exist')

    cy.log('Checking inperson asks for zip code')
    cy.get('#inperson').check({force: true})
    cy.get('#zip')
  })
})
