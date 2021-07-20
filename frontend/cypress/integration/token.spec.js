describe('Routing to /token/*', () => {
  it('Entering the token in the form at / should navigate to the expected page', () => {
    cy.visit('/')
    cy.get('form').within($form => {
      cy.get('input[name=token]')
        .type("R4nd0m")
      cy.get($form).submit()
    })
    cy.url().should('eq', Cypress.config().baseUrl + '/token/R4nd0m')
    cy.get('main').contains('Token was created by Mission Lifeline')
    cy.get('main').contains('1 Supervisors are available')
  })
})

describe('Test different tokens', () => {
  /** This also tests, that direct navigation to the token works (requires correct webserver configuration) **/

  it('Valid, but limited token', () => {
    cy.visit('/token/R4nd0m')
    cy.get('main').contains('Token was created by Mission Lifeline')
    cy.get('main').contains('1 Supervisors are available')
  })

  it('Valid, less limited token', () => {
    cy.visit('/token/T0p53cret')
    cy.get('main').contains('Token was created by Sea-Watch')
    cy.get('main').contains('2 Supervisors are available')
  })

  it('Invalid token', () => {
    cy.visit('/token/noclue')
    cy.get('main').contains('Maybe there is an typing error in the Token', { timeout: 10000 })
    cy.get('main').not(':contains("Token was created by")')
    cy.get('main').not(':contains("Supervisor")')
  })
})
