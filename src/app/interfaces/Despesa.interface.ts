export interface Despesa {
    
    id: number;
    contaId: number;
    titulo: string;
    descricao: string;
    valor: number;
    paga: boolean;
    vencimento: Date | string;

}