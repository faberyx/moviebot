/// <reference types="cypress"/>
import { login } from '../utils/login';

describe('Help tests', () => {
  it('User can access the help page', () => {
    //
    login();

    //
    // MOVE TO THE HELP PAGE
    //
    cy.get('[data-testid=help-tab]').click();

    //HELP PAGE SHOULD BE VISIBLE
    cy.get('[data-testid=help-page').should('be.visible');
  });

  it('User can click on an item in the help page', () => {
    //
    login();

    //
    // MOVE TO THE RATED MOVIES PAGE
    //
    cy.get('[data-testid=help-tab]').click();

    // CLICK ON THE HELP FOR DIRECTOR THAT WILL FILL THE DIRRECTOR INPUT
    cy.get('[data-testid=help-director').click();

    //
    //   MESSAGE ADDED TO THE INPUT
    //
    cy.get('[data-testid=chat-input]>input').should('have.value', 'find a movie by Christopher Nolan');
  });
});
