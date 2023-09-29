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

    getSaldoAtual(idUsuario: number): Observable<number> {
        return this._http.get<number>(APP.api + 'usuario/' + idUsuario + '/saldo');
    }

    get(id: number): Observable<Usuario> {
        return this._http.get<Usuario>(APP.api + 'usuario/' + id);
    }

    put(dados: Usuario): Observable<Usuario> {
        return this._http.put<Usuario>(APP.api + 'usuario/' + dados.id, dados);
    }

    patch(dados: Usuario): Observable<Usuario> {
        return this._http.patch<Usuario>(APP.api + 'usuario/' + dados.id + '/perfil', dados);
    }

}