import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Conta } from "../interfaces/Conta.interface";
import { APP } from "src/environment";

@Injectable({
    providedIn: 'root'
})
export class ContaService {

    constructor(private _http: HttpClient){}

    get(id: number, idUsuario: number): Observable<Conta> {
        return this._http.get<Conta>(APP.api + 'conta/' + id + '/usuario/' + idUsuario);
    }
    
    getAllByIdUsuario(idUsuario: number): Observable<Conta[]> {
        return this._http.get<Conta[]>(APP.api + 'conta/usuario/' + idUsuario);
    }

    getContaPadraoByIdUsuario(idUsuario: number): Observable<Conta> {
        return this._http.get<Conta>(APP.api + 'conta/usuario/' + idUsuario + '/padrao');
    }

    post(conta: Conta): Observable<Conta> {
        return this._http.post<Conta>(APP.api + 'conta/', conta);
    }

    put(conta: Conta): Observable<Conta> {
        return this._http.put<Conta>(APP.api+ 'conta/' + conta.id, conta);
    }

    delete(id: number, idUsuario: number): Observable<any> {
        return this._http.delete(APP.api+ 'conta/' + id + '/usuario/' + idUsuario);
    }


}