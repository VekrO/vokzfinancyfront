export class Receita {
    id: number;
    contaId: number;
    titulo: string;
    descricao: string;
    valor: number;
    paga: boolean;
    data: Date | string;
    
    constructor(id: number, contaId: number, titulo: string, descricao: string, valor: number, paga: boolean, data: Date | string) {
        this.id = id;
        this.contaId = contaId;
        this.titulo = titulo;
        this.descricao = descricao;
        this.valor = valor;
        this.paga = paga;
        this.data = data;
    }
}
