/**
 * PERFORMS A LOGIN ON THE WEBSITE
 */
export const login = () => {
  cy.visit('/login');

  const loginPassword = '&Password99';
  const emailAddress = '330f51e4-e8ec-48ea-b2d3-8e3fe271853a@mailslurp.com';

  //
  // SET EMAIL AND PASSWORD VALUES
  //
  cy.get('[data-testid=email]>div>input').type(emailAddress).should('have.value', emailAddress);
  cy.get('[data-testid=password]>div>input').type(loginPassword).should('have.value', loginPassword);

  // LOGIN THE USER
  cy.get('[data-testid=login-button]').click();
};
