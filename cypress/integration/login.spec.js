describe('Login Page', function() {
  it('sets auth cookie when logging in via form submission', function () {
    const email = "admin@admin.local";
    const password = "Password12";

    cy.visit('/login');

    cy.get('input[name=email]').type(email);

    // {enter} causes the form to submit
    cy.get('input[name=password]').type(`${password}{enter}`);

    cy.url().should('include', '/dashboard');

    cy.getCookie('connect.sid').should('exist');

    cy.get('p').should('contain', 'admin@admin.local');
    cy.get('a').should('contain', 'Atsijungti');
  })
});
