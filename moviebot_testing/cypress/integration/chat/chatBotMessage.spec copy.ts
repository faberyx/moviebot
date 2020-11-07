/// <reference types="cypress"/>
import { login } from '../utils/login';

describe('Chatbot Tests', () => {
  it('User can search for a horror movie', () => {
    //
    login();
    const message = 'horror movie';
    //
    // WRITE A MESSAGE TO THE BOT
    //
    cy.get('[data-testid=chat-input]>input').type(message).should('have.value', message);

    //
    // CHECK THE CHATBOX INTERACTION FOR BOT RESPONSE
    //
    cy.get('[data-testid=sendchat-button]').click();

    //
    // CHECK THE CHATBOX BUBBLES
    //
    cy.get('[data-testid=chatbubble-text-bot]').should('have.length', 3);
    cy.get('[data-testid=chatbubble-text-human]').should('have.length', 1);
    // CHECK THE CONTENT OF THE MESSAGE
    cy.get('[data-testid=chatbubble-text-human]').should('contain.text', message);
  });

  it('User can start a new search session', () => {
    //
    login();
    const message = 'horror movie';

    //
    // WRITE A MESSAGE TO THE BOT
    //
    cy.get('[data-testid=chat-input]>input').type(message).should('have.value', message);

    //
    // CHECK THE CHATBOX INTERACTION FOR BOT RESPONSE
    //
    cy.get('[data-testid=sendchat-button]').click();

    cy.get('[data-testid=chatbubble-text-bot]').should('have.length', 3);

    //
    // RESET THE SESSION
    //
    cy.get('[data-testid=resetchat-button]').click();

    //
    // CHECK THE CHATBOX BUBBLES - SHOULD BE ALL CLEARED BUT THE INITIAL ONE
    //
    cy.get('[data-testid=chatbubble-text-bot]').should('have.length', 1);
    cy.get('[data-testid=chatbubble-text-human]').should('have.length', 0);
  });

  it('Chatbot displays the correct amount of movies', () => {
    //
    login();
    const message = 'horror movie';

    //
    // WRITE A MESSAGE TO THE BOT
    //
    cy.get('[data-testid=chat-input]>input').type(message).should('have.value', message);

    //
    // CHECK THE CHATBOX INTERACTION FOR BOT RESPONSE
    //
    cy.get('[data-testid=sendchat-button]').click();

    //
    // THE RIGHT SIDEOF THE CHATBOT SHOULD DISPLAY ALL MOVIES FOUND
    //
    cy.get('[data-testid=movies-grid]').children().should('have.length', 12);
  });

  it('User can select a movie and can see the movie details', () => {
    //
    login();
    const message = 'horror movie';

    //
    // WRITE A MESSAGE TO THE BOT
    //
    cy.get('[data-testid=chat-input]>input').type(message).should('have.value', message);

    //
    // CHECK THE CHATBOX INTERACTION FOR BOT RESPONSE
    //
    cy.get('[data-testid=sendchat-button]').click();

    cy.get('[data-testid=movies-grid]').children().should('have.length', 12);
    //
    // CHECK THE CHATBOX INTERACTION FOR BOT RESPONSE
    //
    cy.get('[data-testid=movies-tile-1]').click();
  });
});
