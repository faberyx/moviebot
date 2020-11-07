/// <reference types="cypress"/>
import { MailSlurp } from 'mailslurp-client';

describe('Login Tests', () => {
  it.skip('User can reset a forgotten password', () => {
    //
    cy.visit('/forgotpassword');
    const mailslurp = new MailSlurp({ apiKey: '7da1b76d69e5975f79eee0695d55baf2fed4b42f2dee029ecd6bc4fa0ddf1f09' });
    const inboxId = '330f51e4-e8ec-48ea-b2d3-8e3fe271853a';
    const loginPassword = '&Password99';
    const emailAddress = '330f51e4-e8ec-48ea-b2d3-8e3fe271853a@mailslurp.com';

    //
    // SET EMAIL AND PASSWORD VALUES
    //
    cy.get('[data-testid=email]>div>input').type(emailAddress).should('have.value', emailAddress);

    // RESET THE PASSWORD
    cy.get('[data-testid=resetpassword-button]').click();

    //
    // USER SHOULD RECEIVE THE EMAIL WITH THE RESET CODE
    //
    cy.wrap(mailslurp.emptyInbox(inboxId)).then(() => {
      cy.wrap(mailslurp.waitForLatestEmail(inboxId)).then((latestEmail: any) => {
        const codeMatch = latestEmail.body
          .match(/<span data-testid="code">(.*?)<\/span>/g)[0]
          .replace('<span data-testid="code">', '')
          .replace('</span>', '');

        // RETRIEVE THE ACTIVATION CODE FROM THE EMAIL
        cy.wrap(codeMatch.trim()).as('code');
      });
    });
    //
    // WRITE THE CODE RECEIVED IN THE EMAIL IN THE INPUT BOX FOR ACTIVATION
    //
    cy.get('@code').then((code: any) => {
      cy.get('[data-testid=verification-code]>div>input').type(code).should('have.value', code);
    });

    cy.get('[data-testid=password]>div>input').type(loginPassword).should('have.value', loginPassword);
    cy.get('[data-testid=password-repeat]>div>input').type(loginPassword).should('have.value', loginPassword);

    //
    // CLICK THE RESET BUTTON BUTTON
    //
    cy.get('[data-testid=reset-button]').click();
    //
    // IF RESET IS SUCCESSFUL USER IS REDIRECTED TO LOGIN PAGE
    //
    cy.location('pathname').should('eq', '/login');
  });

  it('User cannot reset  with an invalid password', () => {
    //
    cy.visit('/forgotpassword');
    const mailslurp = new MailSlurp({ apiKey: '7da1b76d69e5975f79eee0695d55baf2fed4b42f2dee029ecd6bc4fa0ddf1f09' });
    const inboxId = '330f51e4-e8ec-48ea-b2d3-8e3fe271853a';
    const loginPassword = '&Password99';
    const emailAddress = 'wrong@mailslurp.com';

    //
    // SET EMAIL AND PASSWORD VALUES
    //
    cy.get('[data-testid=email]>div>input').type(emailAddress).should('have.value', emailAddress);

    // RESET THE PASSWORD
    cy.get('[data-testid=resetpassword-button]').click();
  });
});
