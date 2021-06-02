import { LOGIN_SELECTORS } from '../../elements/login-selectors'

describe('test login', function () {
  beforeEach('clear', function () {
    cy.clearLocalStorage()
    cy.clearCookies()
  })
  it('test manual login', function () {
    cy.intercept('POST', `/api/auth/callback/credentials?`).as('login')
    cy.intercept('GET', `/api/auth/providers`).as('providers')
    cy.intercept('GET', `/api/auth/csrf`).as('csrf')
    cy.intercept('GET', `/api/auth/session`).as('session')
    cy.visit('/login')

    cy.get(LOGIN_SELECTORS.form).should('be.visible')
    cy.get(LOGIN_SELECTORS.username)
      .type('user_test_manager@test.cat')
      .should('have.value', 'user_test_manager@test.cat')
    cy.get(LOGIN_SELECTORS.password).type('Iskra1234').should('have.value', 'Iskra1234')
    cy.get(LOGIN_SELECTORS.form).submit()
    cy.wait('@providers')
    cy.wait('@csrf')
    cy.wait('@login')
    cy.wait('@session')

    cy.get(LOGIN_SELECTORS.form).should('not.exist')
    cy.contains('USER LOGGED').should('be.visible')
  })
})
