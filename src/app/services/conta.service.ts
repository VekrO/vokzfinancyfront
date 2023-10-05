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

    get(id: number): Observable<Conta> {
        return this._http.get<Conta>(APP.api + 'conta/' + id);
    }
    
    getAllByIdUsuario(idUsuario: number): Observable<Conta[]> {
        return this._http.get<Conta[]>(APP.api + 'conta/usuario/' + idUsuario);
    }


}