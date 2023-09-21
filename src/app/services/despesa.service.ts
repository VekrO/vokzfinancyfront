import { DespesaList } from './../interfaces/DespesaList.interface';
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

    getByIdUsuarioAsync(usuarioId: number): Observable<DespesaList[]> {
        return this._http.get<DespesaList[]>(APP.api + 'despesa/usuario/' + usuarioId);
    }

    insert(despesa: Despesa): Observable<Despesa> {
        return this._http.post<Despesa>(APP.api + 'despesa/', despesa);
    }

    update(despesa: Despesa): Observable<Despesa> {
        return this._http.put<Despesa>(APP.api+ 'despesa/' + despesa.id, despesa);
    }

}