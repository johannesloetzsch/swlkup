let token_url = ""  // will be set once a new token was generated
let supervisor_password = "" // will be set once a new supervisor was invited

/** Integration test, running each core feature once, high level checking most important routes and resolvers **/
describe('Walk through', () => {

  it('Ngo: Create token and invite supervisor', () => {
    cy.visit('/ngo')
    cy.get('form').within($form => {
      cy.get('input[name=mail]')
        .type("crewing@example-ngo.com")
      cy.get('input[name=password]')
        .type("Vr(+cFtUG=rsj2:/]*uR")
      cy.get($form).submit()
    })
    cy.get('form[id="token_form"]').within($form => {
      cy.get('textarea[name=purpose]')
	.type("Next Mission")
      cy.get($form).submit()
    })
   cy.get('a.token').invoke('attr', 'href').then($href => { token_url = $href })
   cy.log(token_url)

    cy.get('form[id="invitation_form"]').within($form => {
      cy.get('input[name=supervisor_email]')
	.type("supervisor@example.com")

      cy.exec('rm /tmp/mail.log || true')
      cy.get($form).submit()
    })
    cy.get('main').contains('registered supervisors')
    cy.log('HINT: till now this test is not idempotent since the supervisor is not being deleted')
    cy.exec('cat /tmp/mail.log').then($result => {
      supervisor_password = $result.stdout.split('\n').filter(l => l.startsWith("Password:"))[0].split(' ')[1]
    })
  })

  it('Edit new supervisor', () => {
    cy.visit('/supervisor/edit')
    cy.get('form').within($form => {
      cy.get('input[name=mail]')
        .type("supervisor@example.com")
      cy.get('input[name=password]')
        .type(supervisor_password)
      cy.get($form).submit()
    })
    cy.get('form[id="supervisor_form"]').within($form => {
      cy.get('#it').check({force: true})
      cy.get('#moderation').check()
      cy.get('input[value=example_ngo]').check()
      cy.get('input[name=email]').clear().type('supervisor@example.com')
      cy.get('input[name=name_full]').clear().type('F. Nord')
      cy.get('input[name=text_specialization]').clear().type('Writing Testcases')
      cy.get('textarea[name=text]').clear().type('…')
      cy.get($form).submit()
    })
  })

  it('Token: New supervisor visible by new token?', () => {
    cy.log(token_url)
    cy.visit(token_url)
    cy.get('main').contains('F. Nord')
  })

  it('Delete profile of the new supervisor', () => {
    cy.visit('/supervisor/edit')
    cy.get('form').within($form => {
      cy.get('input[name=mail]')
        .type("supervisor@example.com")
      cy.get('input[name=password]')
        .type(supervisor_password)
      cy.get($form).submit()
    })
    cy.get('input[type=button][name=delete]').click()
    cy.get('input[id=confirm_delete]').check()
    cy.get('input[type=button][name=delete]').click()
    cy.get('main').contains('Your account has been deleted.')
  })

  it('New supervisor should not be longer visible', () => {
    cy.log(token_url)
    cy.visit(token_url)
    cy.get('main').contains('1 Supervisor matches these filters')
    cy.get('main').not(':contains("F. Nord")')
  })
})
