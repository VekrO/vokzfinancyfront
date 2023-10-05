import { Conta } from "./Conta.interface";

export interface Usuario {

    id: number;
    email: string;
    name: string;
    password: string;
    accounts: Conta[];

}