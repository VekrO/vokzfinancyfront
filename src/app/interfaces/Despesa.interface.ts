export interface Despesa {
    
    id: number;
    ContaId: number;
    titulo: string;
    descricao: string;
    valor: number;
    paga: boolean;
    vencimento: Date | string;

}