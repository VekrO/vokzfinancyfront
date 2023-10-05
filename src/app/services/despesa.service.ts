import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Despesa } from "../interfaces/Despesa.interface";
import { HttpClient } from '@angular/common/http';
import { APP } from "src/environment";

@Injectable({
    providedIn: 'root'
})
export class DespesaService {

    constructor(private _http: HttpClient) {}
    
    getByIdAsync(id: number): Observable<Despesa> {
        return this._http.get<Despesa>(APP.api + 'despesa/' + id);
    }

    getByIdContaAsync(idConta: number): Observable<Despesa[]> {
        return this._http.get<Despesa[]>(APP.api + 'despesa/conta/' + idConta);
    }

    getVencidoByIdContaAsync(idConta: number): Observable<Despesa[]> {
        return this._http.get<Despesa[]>(APP.api + 'despesa/conta/' + idConta + '/vencido');
    }

    getValorByIdContaAsync(idConta: number): Observable<number> {
        return this._http.get<number>(APP.api + 'despesa/conta/' + idConta + '/despesas/valor');
    }

    post(despesa: Despesa): Observable<Despesa> {
        return this._http.post<Despesa>(APP.api + 'despesa/', despesa);
    }

    put(despesa: Despesa): Observable<Despesa> {
        return this._http.put<Despesa>(APP.api+ 'despesa/' + despesa.id, despesa);
    }

    delete(id: number, idConta: number): Observable<any> {
        return this._http.delete(APP.api+ 'despesa/' + id + '/conta/' + idConta);
    }

}