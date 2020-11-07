/// <reference types="cypress"/>
import { login } from '../utils/login';

describe('Watchlist Tests', () => {
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
    //
    // CLICK THE ADD TO WATCHLIST BUTTON
    //
    cy.get('[data-testid=moviedetail-watchlist-button]').click();
    //
    // WATCHLIST ICON SHOULD BE VISIBLE
    //
    cy.get('[data-testid=watchlisted]').should('be.visible');
  });

  it('User can access a watchlisted movie and can remove it from the list', () => {
    //
    login();
    const message = 'horror movie';

    //
    // WRITE A MESSAGE TO THE BOT
    //
    cy.get('[data-testid=chat-input]>input').type(message).should('have.value', message);

    //
    // MOVE TO THE WATCHLIST MOVIES PAGE
    //
    cy.get('[data-testid=watchlist-tab]').click();

    cy.get('[data-testid=moviewatchlist-tile-0]').should('be.visible');
    //
    //REMOVE THE MOVIE FROM WATCHLIST
    //
    cy.get('[data-testid=moviewatchlist-remove-0-button]').click();
    //
    //CHECK THERE ARE NO MORE WATCHLISTED MOVIES IN THE PAGE
    //
    cy.get('.MuiAlert-message').should('contain.text', 'No wishlist movies found');
  });
});
