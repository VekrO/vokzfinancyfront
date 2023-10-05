import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP } from "src/environment";
import { Usuario } from "../interfaces/Usuario.interface";

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

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

    getSaldo(idUsuario: number): Observable<number> {
        return this._http.get<number>(APP.api + 'usuario/' + idUsuario + '/saldo');
    }

    getValorReceitasByIdUsuarioAsync(idUsuario: number): Observable<number> {
        return this._http.get<number>(APP.api + 'usuario/' + idUsuario + '/receitas/valor');
    }

    getValorDespesasByIdUsuarioAsync(idUsuario: number): Observable<number> {
        return this._http.get<number>(APP.api + 'usuario/' + idUsuario + '/despesas/valor');
    }


}