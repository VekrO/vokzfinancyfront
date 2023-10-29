import { Conta } from "./Conta.model";

export class Usuario {
    id: number;
    email: string;
    name: string;
    password: string;
    accounts: Conta[];

    constructor(id: number, email: string, name: string, password: string, accounts: Conta[]) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.password = password;
        this.accounts = accounts;
    }
}
