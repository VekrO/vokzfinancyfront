export class DespesaGrafico {
    id: number;
    ContaId: number;
    valor: number;
    data: number;

    constructor(id: number, ContaId: number, valor: number, data: number) {
        this.id = id;
        this.ContaId = ContaId;
        this.valor = valor;
        this.data = data;
    }
}
