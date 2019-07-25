describe('Users', function () {
  it('Admin creates new user, login with it to check information and delete user', function () {
    const adminEmail = Cypress.env('ADMIN_EMAIL');
    const adminPassword = Cypress.env('ADMIN_PASSWORD');

    // programmatically log us in without needing the UI
    cy.request('POST', 'http://localhost:5000/api/auth/login', {
      email: adminEmail,
      password: adminPassword,
    });

    cy.visit('/users');
    cy.getCookie('connect.sid').should('exist');

    cy.contains('button', "Add User").click();

    const user = {
      firstName: 'TFirst',
      lastName: 'TLast',
      email: 'test.user2000@email.com',
      password: 'Password12',
      phoneNumber: '+37012345678',
      court: 'Marijampolės apylinkės teismas Marijampolės rūmai',
    };

    cy.get('input[name="firstName"]').type('TFirst').should('have.value', 'TFirst');
    cy.get('input[name="lastName"]').type('TLast').should('have.value', 'TLast');
    cy.get('input[name="email"]').type(user.email).should('have.value', user.email);
    cy.get('input[name="phoneNumber"]').type(user.phoneNumber).should('have.value', user.phoneNumber);
    cy.get('select[name="court"]').select(user.court)
      .should('have.value', user.court);

    cy.get('input[name="password"]').type(user.password).should('have.value', user.password);
    cy.get('input[name="passwordConfirmation"]').type(`${user.password}{enter}`);

    cy.wait(500);

    cy.request('POST', 'http://localhost:5000/api/auth/logout');
    cy.getCookie('connect.sid').should('not.exist');

    cy.request('POST', 'http://localhost:5000/api/auth/login', {
      email: user.email,
      password: user.password,
    });

    cy.visit('/dashboard');
    cy.getCookie('connect.sid').should('exist');

    cy.contains('.card-text', user.email);
    cy.contains('.card-text', user.firstName);
    cy.contains('.card-text', user.lastName);
    cy.contains('.card-text', user.court);
    cy.contains('.card-text', user.phoneNumber);

    // // cy.request('POST', 'http://localhost:5000/api/auth/logout', {withCredentials: true});
    cy.request('POST', 'http://localhost:5000/api/auth/logout');
    cy.getCookie('connect.sid').should('not.exist');

    cy.request('POST', 'http://localhost:5000/api/auth/login', {
      email: adminEmail,
      password: adminPassword,
    });
    cy.visit('/users');
    cy.getCookie('connect.sid').should('exist');

    cy.contains('div[role="row"]', 'test.user2000@email.com').within(() => {
      cy.get('.btn-danger').click();
    });
    cy.contains('button', "Yes").click();
  })
});

