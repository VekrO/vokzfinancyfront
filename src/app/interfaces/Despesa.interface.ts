export interface Despesa {
    
    id: number;
    idConta: number;
    titulo: string;
    descricao: string;
    valor: number;
    paga: boolean;
    vencimento: Date | string;

}