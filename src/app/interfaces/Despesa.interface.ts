export interface Despesa {
    
    id: number;
    idUsuario: number;
    titulo: string;
    descricao: string;
    valor: number;
    vencimento: Date | string;

}