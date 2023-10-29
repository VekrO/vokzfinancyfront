export class Conta {
    
    id: number;
    nome: string;
    UsuarioId: number;
    padrao: boolean;
    descricao: string;

    constructor(id: number, nome: string, UsuarioId: number, padrao: boolean, descricao: string) {
        this.id = id;
        this.nome = nome;
        this.UsuarioId = UsuarioId;
        this.padrao = padrao;
        this.descricao = descricao;
    }

}