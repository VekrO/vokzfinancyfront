import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UsuarioLogin } from "../interfaces/UsuarioLogin.interface";
import { APP } from "src/environment";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { Router } from "@angular/router";
import { Usuario } from "../interfaces/Usuario.interface";

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {

    constructor(private _http: HttpClient, private _router: Router) {}

    login(dados: UsuarioLogin): Observable<any> {
        return this._http.post(APP.api + 'authentication/login', dados);
    }

    setToken(token: string) {
        localStorage.setItem('token', token);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getUsuario(): Usuario {
        const decoded: any = Object.assign({}, jwtDecode(this.getToken() ?? ''));
        return {
            id: Number(decoded['id']),
            email: decoded['nameid']
        } as Usuario;
    }

    isLoggedIn(): boolean {

        try {

            const decoded: JwtPayload  = Object.assign({}, jwtDecode(this.getToken() ?? ''));
            
            if(decoded && decoded.exp) {
                if (Date.now() >= decoded.exp * 1000) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
            
        } catch (err) {
            return false;
        }

    }

}