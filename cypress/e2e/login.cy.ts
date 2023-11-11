import { notifierClass } from "cypress/support/e2e";

describe('Login', () => {

  const emailValid: string = 'cgrenancontato@hotmail.com';
  const emailInvalid: string = 'usuarioinexistente@gmail.com';
  const password: string = '123';

  it('Deve conseguir conectar na conta!', () => {
    
    cy.intercept('https://localhost:7130/api/v1/authentication/login').as('login');

    cy.visit('');
    cy.get('[formcontrolname=email]').type(emailValid);
    cy.get('[formcontrolname=password]').type(password);
    cy.get('button[type=submit]').click();
    cy.wait('@login').then(() => {
      cy.url().should('eq', 'http://localhost:4200/dashboard');
    });

  });

  it('Não deve conseguir se conectar em uma conta inexistente!', () => {

    cy.visit('');
    cy.intercept('https://localhost:7130/api/v1/authentication/login').as('login');
    cy.get('[formcontrolname=email]').type(emailInvalid);
    cy.get('[formcontrolname=password]').type(password);
    cy.get('button[type=submit]').click();
    cy.wait('@login').then(() => {
      cy.get(notifierClass).contains('Verifique os dados e tente novamente!');
    });

  });

  it('O botão de SUBMIT deve ficar desabilitado caso o formulário esteja inválido!', () => {

    cy.visit('');
    cy.get('[formcontrolname=password]').type('123');
    cy.get('button[type=submit]').should('be.disabled');

  });


});