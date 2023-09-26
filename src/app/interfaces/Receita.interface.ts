export interface Receita {
    
    id: number;
    idUsuario: number;
    titulo: string;
    descricao: string;
    valor: number;
    data: Date | string;

}