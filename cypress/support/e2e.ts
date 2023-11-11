// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.Commands.add('login', () => {

    const email: string = 'cgrenancontato@hotmail.com';
    const password: string = '123';

    cy.session('usuario', () => {
        cy.visit('http://localhost:4200');
        cy.intercept('https://localhost:7130/api/v1/authentication/login').as('login');
        cy.get('[formcontrolname=email]').type(email);
        cy.get('[formcontrolname=password]').type(password);
        cy.get('button[type=submit]').click();
        cy.wait('@login').then(() => {
            cy.url().should('eq', 'http://localhost:4200/dashboard');
        });
    });

});

Cypress.Commands.add('getSessionStorage', (key) => {
    cy.window().then((window) => window.sessionStorage.getItem(key))
});

Cypress.Commands.add('setSessionStorage', (key, value) => {
    cy.window().then((window) => {
        window.sessionStorage.setItem(key, value)
    });
});

export const notifierClass = '.notifier__notification-message';