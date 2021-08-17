function assert_loggedIn() {
  cy.get('main').contains('Logout')
  cy.get('main').not(':contains("Login")')
  cy.window().then((win) => {assert.isDefined(win.localStorage.jwt)})
}

function assert_loggedOut() {
  cy.get('main').contains('Login')
  cy.get('main').not(':contains("Logout")')
  cy.window().then((win) => {assert.isUndefined(win.localStorage.jwt)})
}

describe('Login', () => {
  it('Login + Use Session + Logout', () => {
    cy.visit('/supervisor/edit')
    cy.get('form').within($form => {
      cy.get('input[name=mail]')
        .type("praxis@max.mueller.de")
      cy.get('input[name=password]')
        .type("i!A;z\\\"'^G3Q)w])%83)")
      cy.get($form).submit()
    })
    assert_loggedIn()

    cy.log('Session remains logged in, because jwt is stored in localstore')
    cy.visit('/supervisor/edit')
    assert_loggedIn()

    cy.log('Logout')
    cy.get('form').within($form => {
      cy.get($form).submit()
    })
    assert_loggedOut()
  })

/*
  it('Logout when JWT is expired', () => {
    cy.visit('/supervisor/edit',  {
      onBeforeLoad(win) {
        localStorage.setItem('jwt', 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MDk0NTU2MDAsInN1YiI6MTIzNDU2Nzg5fQ.T9byWbdA0HLoLyrqB-7JU6x2CYBpnKVLhgnEqUzWwOI')
      }
    })
    assert_loggedOut()

    cy.log('Test this testcase with a token from the future')
    cy.visit('/supervisor/edit',  {
      onBeforeLoad(win) {
        localStorage.setItem('jwt', 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjMyNTAzNjc2NDAwLCJzdWIiOjEyMzQ1Njc4OX0.KODwPvBk5ty7VvjShkr5Fc8xsOOoPC0C8op38tExjrw')
      }
    })
    assert_loggedIn()
  })
*/

  it('Wrong password', () => {
    cy.visit('/supervisor/edit')
    cy.get('form').within($form => {
      cy.get('input[name=mail]')
        .type("praxis@max.mueller.de")
      cy.get('input[name=password]')
        .type("wrong")
      cy.get($form).submit()
    })
    assert_loggedOut()
  })
})
