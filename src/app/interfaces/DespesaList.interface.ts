export interface DespesaList {

    id: number;
    usuarioId: number;
    titulo: string;
    descricao: string;
    valor: number;
    vencimento: Date | string;
    createdAt: Date | string;
    updatedAt: Date | string;

}