import { notifierClass } from "cypress/support/e2e";

describe('Register', () => {

    const name = 'usuariofeitonocypress';
    const email = Date.now().toString() + '@gmail.com';
    const password = '123';

    it('Deve conseguir criar uma conta nova!', () => {
        
        cy.visit('/register');

        cy.intercept('https://localhost:7130/api/v1/authentication/register').as('register');

        cy.get('[formcontrolname=name]').type(name);
        cy.get('[formcontrolname=email]').type(email);
        cy.get('[formcontrolname=password]').type(password);
        cy.get('button[type=submit]').click();
        cy.wait('@register').then(() => {
            cy.url().should('eq', 'http://localhost:4200/');
            cy.get(notifierClass).contains('Sucesso, você foi redirecionado o login!');
        });

    });

    it('Não deve conseguir criar uma conta nova já existente!', () => {
        
        cy.visit('/register');

        cy.intercept('https://localhost:7130/api/v1/authentication/register').as('register');

        cy.get('[formcontrolname=name]').type(name);
        cy.get('[formcontrolname=email]').type(email);
        cy.get('[formcontrolname=password]').type(password);
        cy.get('button[type=submit]').click();
        
        cy.wait('@register').then(() => {
            cy.url().should('eq', '/register');
            cy.get(notifierClass).contains('O e-mail já está sendo utilizado!');
        });

    });

    it('O botão de SUBMIT deve ficar desabilitado caso o formulário esteja inválido!', () => {

        cy.visit('/register');
        cy.get('[formcontrolname=email]').type(email);
        cy.get('[formcontrolname=password]').type(password);
        cy.get('button[type=submit]').should('be.disabled');

    });

    

});