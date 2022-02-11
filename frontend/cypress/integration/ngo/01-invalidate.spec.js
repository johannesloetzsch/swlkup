let token_url, token = ""  // will be set once a new token was generated

describe('Invalidate Token', () => {

  it('Ngo: Create token', () => {
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
	.type("Test token invalidation")
      cy.get($form).submit()
    })
   cy.get('a.token_valid').invoke('attr', 'href').then($href => {
     token_url = $href
     token = token_url.replace(/.*\//, '')
   })
   cy.log(token)
  })

  it('Initially the token should be valid', () => {
    cy.visit(token_url)
    cy.get('main').contains('1 Supervisor matches these filters')
  })

  it('Ngo: Invalidate token', () => {
    cy.visit('/ngo')
    cy.get('form').within($form => {
      cy.get('input[name=mail]')
        .type("crewing@example-ngo.com")
      cy.get('input[name=password]')
        .type('Vr(+cFtUG=rsj2:/]*uR')
      cy.get($form).submit()
    })
    cy.get(`input[type=button][name=${token}]`).click()
    cy.get('input[id=confirm_invalidation]').check()
    cy.get(`input[type=button][name=${token}]`).click()
  })

  it('The Token should now be disabled', () => {
    cy.visit(token_url)
    cy.get('main').contains('This is not a valid Token')
  })
})
