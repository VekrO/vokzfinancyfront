import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Despesa } from "../models/Despesa.model";
import { HttpClient } from '@angular/common/http';
import { APP } from "src/environments/environment";
import { DespesaGrafico } from "../models/DespesaGrafico.model";

@Injectable({
    providedIn: 'root'
})
export class DespesaService {

    constructor(private _http: HttpClient) {}
    
    getByIdAsync(id: number, idUsuario: number): Observable<Despesa> {
        return this._http.get<Despesa>(APP.api + 'despesa/' + id + '/usuario/' + idUsuario);
    }

    getByContaIdAsync(ContaId: number, dtIni: string, dtFim: string): Observable<Despesa[]> {
        return this._http.get<Despesa[]>(APP.api + 'despesa/conta/' + ContaId + '/dtIni/' + dtIni + '/dtFim/' + dtFim);
    }

    getAllByIdUsuarioAsync(idUsuario: number, dtIni: string, dtFim: string): Observable<Despesa[]> {
        return this._http.get<Despesa[]>(APP.api + 'despesa/usuario/' + idUsuario + '/despesas/dtIni/' + dtIni + '/dtFim/' + dtFim);
    }

    getGraficoByContaIdAsync(ContaId: number): Observable<DespesaGrafico[]> {
        return this._http.get<DespesaGrafico[]>(APP.api + 'despesa/conta/' + ContaId + '/grafico');
    }

    getVencidoByContaIdAsync(ContaId: number, dtIni: string, dtFim: string): Observable<Despesa[]> {
        return this._http.get<Despesa[]>(APP.api + 'despesa/conta/' + ContaId + '/vencido' + '/dtIni/' + dtIni + '/dtFim/' + dtFim);
    }

    getValorByContaIdAsync(ContaId: number): Observable<number> {
        return this._http.get<number>(APP.api + 'despesa/conta/' + ContaId + '/despesas/valor');
    }

    post(despesa: Despesa): Observable<Despesa> {
        return this._http.post<Despesa>(APP.api + 'despesa/', despesa);
    }

    put(despesa: Despesa): Observable<Despesa> {
        return this._http.put<Despesa>(APP.api+ 'despesa/' + despesa.id, despesa);
    }

    delete(id: number, ContaId: number): Observable<any> {
        return this._http.delete(APP.api+ 'despesa/' + id + '/conta/' + ContaId);
    }

}