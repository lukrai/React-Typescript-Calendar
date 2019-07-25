describe('Dashboard Page', function () {
  it('Admin goes to dashboard and submits a court case checks it in calendar', function () {
    const email = Cypress.env('ADMIN_EMAIL');
    const password = Cypress.env('ADMIN_PASSWORD');

    // programmatically log us in without needing the UI
    cy.request('POST', 'http://localhost:5000/api/auth/login', {
      email,
      password
    });

    cy.visit('/dashboard');
    cy.getCookie('connect.sid').should('exist');

    const fileNo = 'V9-99999-1024/2019';
    cy.get('input[name="fileNo"]').type(fileNo).should('have.value', fileNo);
    cy.get('button[type="submit"]').click().as('submitCourtCase');

    cy.wait(500);

    const firstTableRow = cy.get("table").find('tbody tr:first');
    firstTableRow.find('th').last().invoke('text').then(text => {
      const courtCaseDate = text.split(" ");
      cy.visit('/calendar');
      cy.get(".DayPickerInput > input").clear().type(courtCaseDate[0]).should('have.value', courtCaseDate[0]);
      cy.get('.btn-outline-secondary').click();
      cy.contains('div#cardBody', fileNo).within(() => {
        cy.get('button[name="delete"]').click();
      });
      cy.get('div#cardBody').should('not.contain', fileNo);
    })
  })
});

