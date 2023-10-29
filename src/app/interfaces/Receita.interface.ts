export interface Receita {
    
    id: number;
    contaId: number;
    titulo: string;
    descricao: string;
    valor: number;
    data: Date | string;

}