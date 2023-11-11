import { notifierClass } from "cypress/support/e2e";
import * as moment from "moment";
import { Despesa } from "src/app/models/Despesa.model";

describe('Despesa', () => {

    const baseUrl = Cypress.config('baseUrl');
    let idConta: number = 1;
    let despesa: Despesa;

    beforeEach(() => {
        cy.login();
    });

    it('GET', () => {
        cy.visit('/despesas');
        cy.url().should('eq', `${baseUrl}/despesas`);
    });

    it('GET BY ID', () => {
        
        cy.intercept(`https://localhost:7130/api/v1/despesa/conta/${idConta}/dtIni/2023-11-01/dtFim/2023-12-31`).as('despesas');

        cy.visit('/despesas');
        
        cy.location().should((location) => {
            expect(location.pathname).to.equal('/despesas');
        });

        cy.wait('@despesas').then((res) => {

            const firstItemId: number = res.response?.body[0].id;
                        
            // Pega o primeiro item da listagem.
            cy.get('.item').first().click();

            // Verifica se está no primeiro item da listagem.
            cy.url().should('eq', `${baseUrl}/despesa;id=${firstItemId}`);

        });

    });

    it('POST', () => {

        cy.visit('/despesas');

        cy.intercept('https://localhost:7130/api/v1/despesa').as('despesas');
        
        cy.url().should('eq', `${baseUrl}/despesas`);

        cy.get('button[type=button]').contains('Adicionar').click();

        cy.get('[formcontrolname=titulo]').type('DespesaTestCypress');
        cy.get('[formcontrolname=valor]').type('100');
        cy.get('.slider.round').click();
        cy.get('[formcontrolname=vencimento]').type(moment().format('YYYY-MM-DD'));

        cy.get('button[type=submit]').click();

        cy.wait('@despesas').then((res) => {
            console.log('res: ', res);
            expect(res.response?.statusCode).to.be.equal(200);
            cy.get(notifierClass).contains('Nova despesa criada!');
            despesa = res.response?.body;
        });

    });

    it('EDIT', () => {

        let idDespesa: number = despesa.id;

        cy.visit('/despesas');

        cy.url().should('eq', `${baseUrl}/despesas`);

        cy.get('.item').last().click();

        cy.url().should('eq', `${baseUrl}/despesa;id=${idDespesa}`);

        cy.get('[formcontrolname=titulo]').clear();
        cy.get('[formcontrolname=titulo]').type('DespesaTestCypressEditado');

        cy.get('[formcontrolname=valor]').clear();
        cy.get('[formcontrolname=valor]').type('200');

        cy.get('.slider.round').click();

        cy.get('[formcontrolname=vencimento]').clear();
        cy.get('[formcontrolname=vencimento]').type(moment().add(1, 'day').format('YYYY-MM-DD'));

        cy.intercept(`https://localhost:7130/api/v1/despesa/${idDespesa}`).as('despesas');

        cy.get('button[type=submit]').click();

        cy.wait('@despesas').then((res) => {
            console.log('res: ', res);
            expect(res.response?.statusCode).to.be.equal(200);
            cy.get(notifierClass).contains('Despesa atualizada com sucesso!');
        });


    });

    it('DELETE', () => {

        let idDespesa: number = despesa.id;

        cy.visit('/despesas');

        cy.url().should('eq', `${baseUrl}/despesas`);

        cy.get('.item').last().click();

        cy.url().should('eq', `${baseUrl}/despesa;id=${idDespesa}`);

        cy.intercept(`https://localhost:7130/api/v1/despesa/${idDespesa}/conta/${idConta}`).as('despesas');

        cy.get('.btn-excluir').click();

        cy.get('.modal-container button[type=button].btn-submit').click();

        cy.wait('@despesas').then((res) => {
            console.log('res: ', res);
            expect(res.response?.statusCode).to.be.equal(200);
            cy.get(notifierClass).contains('Registro excluído com sucesso!');
            cy.url().should('eq', `${baseUrl}/despesas`);
        });

    });

});