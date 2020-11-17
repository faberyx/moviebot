/// <reference types="cypress"/>
import { MailSlurp } from 'mailslurp-client';

describe('Registration Tests', () => {
  it('User can register', () => {
    //
    cy.visit('/register');

    const mailslurp = new MailSlurp({ apiKey });

    //
    // CREATE AN INBOX FOR MAILSLURP CLIENT
    //
    cy.wrap(mailslurp.createInbox()).then((inbox) => {
      cy.wrap(inbox).as('inbox');
    });

    //
    // SET EMAIL AND PASSWORD VALUES
    //
    cy.get('@inbox').then((inbox: any) => {
      cy.get('[data-testid=email]>div>input').type(inbox.emailAddress).should('have.value', inbox.emailAddress);
    });

    cy.get('[data-testid=password]>div>input').type(registerPassword).should('have.value', registerPassword);
    cy.get('[data-testid=repeat-password]>div>input').type(registerPassword).should('have.value', registerPassword);

    //
    // CLICK THE REGISTER BUTTON
    //
    cy.get('[data-testid=register-button]').click();
    cy.get('@inbox').then((inbox: any) => {
      cy.wrap(mailslurp.waitForLatestEmail(inbox.id)).then((latestEmail: any) => {
        const codeMatch = latestEmail.body
          .match(/<span data-testid="code">(.*?)<\/span>/g)[0]
          .replace('<span data-testid="code">', '')
          .replace('</span>', '');

        // RETRIEVE THE ACTIVATION CODE FROM THE EMAIL
        cy.wrap(codeMatch).as('code');
      });
    });

    //
    // WAIT TO ARRIVE AT THE CONFIRM EMAIL PAGE
    //
    cy.location('pathname').should('include', '/confirm');

    //
    // WRITE THE CODE RECEIVED IN THE EMAIL IN THE INPUT BOX FOR ACTIVATION
    //
    cy.get('@code').then((code: any) => {
      cy.get('[data-testid=confirmationcode]>div>input').type(code).should('have.value', code);
    });

    //
    // ACTIVATE THE USER
    //
    cy.get('[data-testid=activate-button]').click();

    //
    // IF USER IS ACTIVATED USER CAN LOGIN
    //
    cy.location('pathname').should('include', '/login');

    //
    // LOGIN THE USER WITH THE REGISTERED EMAIL AND PASSWORD
    //
    cy.get('@inbox').then((inbox: any) => {
      cy.get('[data-testid=email]>div>input').type(inbox.emailAddress).should('have.value', inbox.emailAddress);
    });
    cy.get('[data-testid=password]>div>input').type(registerPassword).should('have.value', registerPassword);

    // LOGIN THE USER
    cy.get('[data-testid=login-button]').click();

    //
    // IF USER IS LOGGED IN CAN OPNE THE MAIN PAGE
    //
    cy.location('pathname').should('eq', '/');

    cy.get('@inbox').then((inbox: any) => {
      mailslurp.deleteInbox(inbox.id);
    });
  });

  it('User cannot register with invalid email', () => {
    cy.visit('/register');
    const registerEmail = `test.com`;
    const registerPassword = '&Password99';
    //
    // ADD A MALFORMED EMAIL
    //
    cy.get('[data-testid=email]>div>input').type(registerEmail).should('have.value', registerEmail);
    cy.get('[data-testid=password]>div>input').type(registerPassword).should('have.value', registerPassword);
    //
    // CLICK THE REGISTER BUTTON
    //
    cy.get('[data-testid=register-button]').click();

    cy.get('[data-testid=email]> .MuiFormHelperText-root').should('contain.html', 'Invalid email');
  });

  it('User cannot register with inalid password', () => {
    cy.visit('/register');
    cy.visit('/register');
    const registerEmail = `test.eamila@test.com`;
    const registerPassword = 'password';
    //
    // ADD A MALFORMED EMAIL
    //
    cy.get('[data-testid=email]>div>input').type(registerEmail).should('have.value', registerEmail);
    cy.get('[data-testid=password]>div>input').type(registerPassword).should('have.value', registerPassword);
    cy.get('[data-testid=repeat-password]>div>input').type(registerPassword).should('have.value', registerPassword);

    //
    // CLICK THE REGISTER BUTTON
    //
    cy.get('[data-testid=register-button]').click();

    //
    // ERROR MESSAGE FOR WRONG PASSWORD MUST BE VISIBLE
    //
    cy.get('.MuiAlert-message').should('be.visible');

    //
    // ERROR MESSAGE SHOULD CONTAIN INFO ABOUT THE WRONG PASSWORD
    //
    cy.get('.MuiAlert-message').should('contain.text', 'Password must have uppercase characters');
  });
});
