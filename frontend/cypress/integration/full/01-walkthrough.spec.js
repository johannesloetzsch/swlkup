let token_url = ""  // will be set once a new token was generated
let supervisor_password = "" // will be set once a new supervisor was invited

function login_supervisor() {
  cy.visit('/supervisor/edit')
  cy.get('form').within($form => {
    cy.get('input[name=mail]')
      .type("supervisor@example.com")
    cy.get('input[name=password]')
      .type(supervisor_password, {parseSpecialCharSequences: false})
    cy.get($form).submit()
  })
}

function assert_visible() {
  cy.log(token_url)
  cy.visit(token_url)
  cy.get('main').contains('F. Nord')
}

function assert_invisible() {
  cy.log(token_url)
  cy.visit(token_url)
  cy.get('main').contains('1 Supervisor matches these filters')
  cy.get('main').not(':contains("F. Nord")')
}

/** High level checking the lifecycle of a supervisor. **/
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
   cy.get('a.token_valid').invoke('attr', 'href').then($href => { token_url = $href })
   cy.log(token_url)

    cy.get('form[id="invitation_form"]').within($form => {
      cy.get('input[name=supervisor_email]')
	.type("supervisor@example.com")

      cy.log('The next instruction might pause, when cypress in running as background job')
      cy.exec('rm /tmp/mail.log || true')
      cy.log('Submitting might fail, when the supervisor already exists (when it was not correctly deleted in the previous test run)')
      cy.get($form).submit()
    })
    cy.get('main').contains('registered supervisors')
    cy.exec('cat /tmp/mail.log').then($result => {
      supervisor_password = $result.stdout.split('\n').filter(l => l.startsWith("Password:"))[0].split(' ')[1]
    })
  })

  it('Edit new supervisor', () => {
    login_supervisor()
    cy.get('form[id="supervisor_form"]').within($form => {
      cy.get('#it').check({force: true})
      cy.get('#moderation').check()
      cy.get('input[value=example_ngo]').check()
      cy.get('input[name=email]').clear().type('supervisor@example.com')
      cy.get('input[name=name_full]').clear().type('F. Nord')
      cy.get('input[name=text_specialization]').clear().type('Writing Testcases')
      cy.get('textarea[name=text]').clear().type('…')
      cy.get('input[name=confirm_privacy_policy]').check()
      cy.get($form).submit()
    })
  })

  it('Token: New supervisor visible by new token?', () => {
    assert_visible()
  })

  it('Deactivate the supervisor', () => {
    login_supervisor()
    cy.get('input[type=button][name=deactivate]').click()
    cy.get('main').contains('Your profile is inactive.')
    assert_invisible()
  })

  it('Reactivate the supervisor', () => {
    login_supervisor()
    cy.get('form[id="supervisor_form"]').within($form => {
      cy.get('input[name=confirm_privacy_policy]').check()
      cy.get($form).submit()
    })
    cy.get('main').contains('Your profile is online')
    assert_visible()
  })

  it('Delete profile of supervisor', () => {
    login_supervisor()
    cy.get('input[type=button][name=delete]').click()
    cy.get('input[id=confirm_delete]').check()
    cy.get('input[type=button][name=delete]').click()
    cy.get('main').contains('Your account has been deleted.')
    assert_invisible()
  })
})
