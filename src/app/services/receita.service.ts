import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { APP } from "src/environments/environment";
import { Receita } from "../models/Receita.model";
import { ReceitaGrafico } from "../models/ReceitaGrafico.model";

@Injectable({
    providedIn: 'root'
})
export class ReceitaService {

    constructor(private _http: HttpClient) {}
    
    getByIdAsync(id: number, idUsuario: number): Observable<Receita> {
        return this._http.get<Receita>(APP.api + 'receita/' + id + '/usuario/' + idUsuario);
    }

    getByContaIdAsync(ContaId: number, dtIni: string, dtFim: string): Observable<Receita[]> {
        return this._http.get<Receita[]>(APP.api + 'receita/conta/' + ContaId + '/dtIni/' + dtIni + '/dtFim/' + dtFim);
    }

    getAllByIdUsuarioAsync(idUsuario: number, dtIni: string, dtFim: string): Observable<Receita[]> {
        return this._http.get<Receita[]>(APP.api + 'receita/usuario/' + idUsuario + '/receitas/dtIni/' + dtIni + '/dtFim/' + dtFim);
    }

    getGraficoByContaIdAsync(ContaId: number): Observable<ReceitaGrafico[]> {
        return this._http.get<ReceitaGrafico[]>(APP.api + 'receita/conta/' + ContaId + '/grafico');
    }

    getValorByContaIdAsync(ContaId: number): Observable<number> {
        return this._http.get<number>(APP.api + 'receita/conta/' + ContaId + '/receitas/valor');
    }

    post(receita: Receita): Observable<Receita> {
        return this._http.post<Receita>(APP.api + 'receita/', receita);
    }

    put(receita: Receita): Observable<Receita> {
        return this._http.put<Receita>(APP.api+ 'receita/' + receita.id, receita);
    }

    delete(id: number, idUsuario: number): Observable<any> {
        return this._http.delete(APP.api+ 'receita/' + id + '/conta/' + idUsuario);
    }

}