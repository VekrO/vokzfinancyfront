export class Despesa {
    id: number;
    contaId: number;
    titulo: string;
    descricao: string;
    valor: number;
    paga: boolean;
    vencida: boolean;
    vencimento: Date | string;

    constructor(id: number, contaId: number, titulo: string, descricao: string, valor: number, paga: boolean, vencida: boolean, vencimento: Date | string) {
        this.id = id;
        this.contaId = contaId;
        this.titulo = titulo;
        this.descricao = descricao;
        this.valor = valor;
        this.paga = paga;
        this.vencida = vencida;
        this.vencimento = vencimento;
    }
}
