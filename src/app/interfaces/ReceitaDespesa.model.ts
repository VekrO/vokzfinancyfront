import { Conta } from "./Conta.model";

export class ReceitaDespesa {

    conta: Conta;
    valorReceita: number;
    valorDespesa: number;

    constructor(conta: Conta, valorReceita: number, valorDespesa: number) {
        this.conta = conta;
        this.valorReceita = valorReceita;
        this.valorDespesa = valorDespesa;
    }

}