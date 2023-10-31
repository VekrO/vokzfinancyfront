import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP } from "src/environments/environment";
import { Usuario } from "../models/Usuario.model";
import { IUsuarioService } from "./interfaces/IUsuarioService";

@Injectable({
    providedIn: 'root'
})
export class UsuarioService implements IUsuarioService {

    constructor(private _http: HttpClient) {}

    get(id: number): Observable<Usuario> {
        return this._http.get<Usuario>(APP.api + 'usuario/' + id);
    }

    put(dados: Usuario): Observable<Usuario> {
        return this._http.put<Usuario>(APP.api + 'usuario/' + dados.id, dados);
    }

    patch(dados: Usuario): Observable<Usuario> {
        return this._http.patch<Usuario>(APP.api + 'usuario/' + dados.id + '/perfil', dados);
    }

    getSaldoByIdUsuarioAsync(idUsuario: number): Observable<number> {
        return this._http.get<number>(APP.api + 'usuario/' + idUsuario + '/saldo');
    }

    getSaldoByIdUsuarioAndIdContaAsync(idUsuario: number, idConta: number): Observable<number> {
        return this._http.get<number>(APP.api + 'usuario/' + idUsuario + '/conta/' + idConta + '/saldo');
    }

    getValorReceitasByIdUsuarioAsync(idUsuario: number, dtIni: string, dtFim: string): Observable<number> {
        return this._http.get<number>(APP.api + 'usuario/' + idUsuario + '/receitas/valor' + '/dtIni/' + dtIni + '/dtFim/' + dtFim);
    }

    getValorDespesasByIdUsuarioAsync(idUsuario: number, dtIni: string, dtFim: string): Observable<number> {
        return this._http.get<number>(APP.api + 'usuario/' + idUsuario + '/despesas/valor' + '/dtIni/' + dtIni + '/dtFim/' + dtFim);
    }

    getValorReceitasByIdUsuarioAndIdContaAsync(idUsuario: number, idConta: number, dtIni: string, dtFim: string): Observable<number> {
        return this._http.get<number>(APP.api + 'usuario/' + idUsuario + '/conta/' + idConta + '/receitas/valor' + '/dtIni/' + dtIni + '/dtFim/' + dtFim);
    }

    getValorDespesasByIdUsuarioAndIdContaAsync(idUsuario: number, idConta: number, dtIni: string, dtFim: string): Observable<number> {
        return this._http.get<number>(APP.api + 'usuario/' + idUsuario + '/conta/' + idConta +'/despesas/valor' + '/dtIni/' + dtIni + '/dtFim/' + dtFim);
    }


}