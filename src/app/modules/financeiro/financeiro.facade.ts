import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { Conta } from "src/app/interfaces/Conta.interface";
import { ContaService } from "src/app/services/conta.service";

@Injectable({
    providedIn: 'root'
})
export class FinanceiroFacade {

    constructor(private contaService: ContaService) {}

    async getContasByUsuario(idUsuario: number): Promise<Conta[]> {
        return new Promise( async (resolve, reject) => {
            const contas$ = this.contaService.getAllByIdUsuario(idUsuario);
            await lastValueFrom(contas$).then((contas) => {
                resolve(contas);
            }).catch((err) => {
                console.log('ERRO: ', err);
                reject(err);
            });
        });
    }

}