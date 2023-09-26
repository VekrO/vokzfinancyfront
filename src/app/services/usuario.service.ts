import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP } from "src/environment";

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    constructor(private _http: HttpClient) {}

    getSaldoAtual(idUsuario: number): Observable<number> {
        return this._http.get<number>(APP.api + 'usuario/' + idUsuario + '/saldo');
    }

}