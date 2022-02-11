function login() {
  cy.get('form').within($form => {
    cy.get('input[name=mail]')
      .type("praxis@max.mueller.de")
    cy.get('input[name=password]')
      .type("i!A;z\\\"'^G3Q)w])%83)")
    cy.get($form).submit()
  })
}

describe('Edit supervisor', () => {
  it('Input validation + minimal required information', () => {
    cy.visit('/supervisor/edit')
    login()
    cy.get('form[id="supervisor_form"]').within($form => {
      cy.get('#de').uncheck({force: true})
      cy.get('#en').uncheck({force: true})
      cy.get('input:invalid').invoke('prop', 'validationMessage').should('equal','Please select at least one language.')
      cy.get('#en').check({force: true})

      cy.get('#crisis_intervention').uncheck()
      cy.get('#supervision').uncheck()
      cy.get('input:invalid').invoke('prop', 'validationMessage').should('equal','Please select at least one offer.')
      cy.get('#crisis_intervention').check()

      cy.get('#all_ngos_false').check()
      cy.get('input[name=ngos]').uncheck()
      cy.get('input:invalid').invoke('prop', 'validationMessage').should('equal','Please select the NGOs you want support or choose the option `Any`.')
      cy.get('input[value=lifeline]').check()

      cy.get('input[name=phone]').clear()
      cy.get('input[name=email]').clear()
      cy.get('input:invalid').invoke('prop', 'validationMessage').should('equal','Please provide a phone number or an email address.')
      cy.get('input[name=email]').type('contact@max-mueller.de')

      cy.get('input[name=name_full]').clear()
      cy.get('input[name=text_specialization]').clear()
      cy.get('textarea[name=text]').clear()
      cy.get('input:invalid').invoke('prop', 'validationMessage').should('equal','Please fill out this field.')
      cy.get('input[name=name_full]').type('M. Müller')
      cy.get('input[name=text_specialization]').type('PTSD')
      cy.get('textarea[name=text]').type('Why not? ;)')

      cy.log('confirm to privacy policy')
      cy.get('input:invalid').invoke('prop', 'validationMessage').should('equal','Please check this box if you want to proceed.')
      cy.get('input[name=confirm_privacy_policy]').check()

      cy.log('optional inputs')
      cy.get('input[name=website]').clear()
      cy.get('input[name=zip]').clear()
      cy.get('input:invalid').should('have.length', 0)
      cy.get($form).submit()
      cy.get('input:invalid').should('have.length', 0)
    })
  })

  it('Check changes to be applied', () => {
    cy.visit('/token/R4nd0m')
    cy.get('main').contains('M. Müller')
    cy.get('main').contains('Why not?')
    cy.get('main').contains('contact@max-mueller.de')

    cy.log('Not visible for tokens of other ngos')
    cy.visit('/token/T0p53cret')
    cy.get('main').not(':contains("M. Müller")')
  })

  it('Reset dataset as expected by other testcases', () => {
    cy.visit('/supervisor/edit')
    login()
    cy.get('form[id="supervisor_form"]').within($form => {
      cy.get('input[name=name_full]').clear().type('Max Müller')
      cy.get('input[name=all_ngos][value=true]').check()
      cy.get($form).submit()
    })
  })
})
