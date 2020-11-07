/// <reference types="cypress"/>
import { login } from '../utils/login';
import { rndNumber } from '../utils/random';

describe('Movie Rating Tests', () => {
  it('User can rate a movie', () => {
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
    // GET A RANDOM RATING NUMBER
    const rate = rndNumber(10);
    // CLICK THE RATING BUTTON
    cy.get('[data-testid=moviedetail-rating-button]').children().eq(rate).click();

    //
    cy.get('[data-testid=moviedetail-rating').should('contain.text', rate);
  });

  it('User can rate a movie and should be in the rating tab', () => {
    //
    login();
    //
    // MOVE TO THE RATED MOVIES PAGE
    //
    cy.get('[data-testid=watchlist-tab]').click();
    cy.get('[data-testid=page-rating-tab]').click();

    //THERE SHOULD BE A RATED MOVIE
    cy.get('[data-testid=movieratingbox').children().should('have.length', 2);
  });
});
