function login() {
  cy.get('form').within($form => {
    cy.get('input[name=mail]')
      .type("crewing@example-ngo.com")
    cy.get('input[name=password]')
      .type("Vr(+cFtUG=rsj2:/]*uR")
    cy.get($form).submit()
  })
}

function create_profile() {
  cy.get('form[id="supervisor_form"]').within($form => {
    cy.get('#en').check({force: true})
    cy.get('#crisis_intervention_refugees').check()
    cy.get('input[value=lifeline]').check()
    cy.get('input[name=email]').type('contact@max-mueller.de')
    cy.get('input[name=name_full]').type('M. Müller')
    cy.get('input[name=text_specialization]').type('PTSD')
    cy.get('textarea[name=text]').type('Why not? ;)')
    cy.get('input[name=confirm_privacy_policy]').check()
    cy.get($form).submit()
  })
}

describe('Deleting profile', () => {
  it('Deleting profile of ngo admin shouldn\'t happen by accident', () => {
    cy.log('„Delete profile of supervisor“ is tested in full/01-walkthrough.spec.js')

    cy.visit('/supervisor/edit')
    login()
    create_profile()
    cy.get('main').contains('Your account is administrator of an NGO')
    cy.get('input[type=button][name=delete]').should('not.exist')

    cy.log('Later tests should not see this supervisor')
    cy.get('input[type=button][name=deactivate]').click()
  })
})
