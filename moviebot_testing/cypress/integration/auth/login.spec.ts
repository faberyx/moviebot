/// <reference types="cypress"/>
import { login } from '../utils/login';

describe('Login Tests', () => {
  it('User can login with correct credentials', () => {
    //
    login();

    //
    // IF USER IS LOGGED IN CAN OPNE THE MAIN PAGE
    //
    cy.location('pathname').should('eq', '/');
  });

  it('User cannot login with wrong credentials', () => {
    cy.visit('/login');
    const loginEmail = `test@email.com`;
    const loginPassword = 'password';
    //
    // USE WRONG  CREDENTIALS
    //
    cy.get('[data-testid=email]>div>input').type(loginEmail).should('have.value', loginEmail);
    cy.get('[data-testid=password]>div>input').type(loginPassword).should('have.value', loginPassword);
    //
    // CLICK THE LOGIN BUTTON
    //
    cy.get('[data-testid=login-button]').click();
    //
    // ERROR MESSAGE SHOULD WARN ABOUT THE WRONG CREDENTIALS
    //
    cy.get('.MuiAlert-message').should('be.visible');
    //
    // IF USER IS NOT LOGGED SHOULD NOT CHANGE PAGE
    //
    cy.location('pathname').should('eq', '/login');
  });
});
