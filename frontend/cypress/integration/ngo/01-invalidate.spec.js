describe('Invalidate Token', () => {

  it('Initially the token should be valid', () => {
    cy.visit('/token/InvalidateTest?lng=en')
    cy.get('main').contains('1 Supervisor matches these filters')
  })

  it('Ngo: Create token and invite supervisor', () => {
    cy.visit('/ngo')
    cy.get('form').within($form => {
      cy.get('input[name=mail]')
        .type("crewing@example-ngo.com")
      cy.get('input[name=password]')
        .type('Vr(+cFtUG=rsj2:/]*uR')
      cy.get($form).submit()
    })
    cy.get('input[type=button][name=InvalidateTest]').click()
  })

  it('The Token should now be disabled', () => {
    cy.visit('/token/InvalidateTest?lng=en')
    cy.get('main').contains('This is not a valid Token')
  })
})
