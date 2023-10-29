import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { Conta } from "src/app/models/Conta.model";
import { ReceitaDespesa } from "src/app/models/ReceitaDespesa.model";
import { ContaService } from "src/app/services/conta.service";

@Injectable({
    providedIn: 'root'
})
export class FinanceiroFacade {

    constructor(private contaService: ContaService) {}

    async getContasByUsuario(idUsuario: number): Promise<Conta[]> {
        const contas$ = this.contaService.getAllByIdUsuario(idUsuario);
        return await lastValueFrom(contas$);
    }

    async getReceitaDespesaByIdConta(idConta: number): Promise<ReceitaDespesa> {
        const valores$ = this.contaService.getReceitaDespesaByIdConta(idConta);
        return await lastValueFrom(valores$);
    }

    async getReceitaDespesaByUsuario(idUsuario: number): Promise<ReceitaDespesa> {
        const valores$ = this.contaService.getReceitaDespesaByIdUsuario(idUsuario);
        return await lastValueFrom(valores$);
    }

}