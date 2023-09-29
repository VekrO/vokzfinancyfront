import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { UsuarioLogin } from "../interfaces/UsuarioLogin.interface";
import { APP } from "src/environment";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { Router } from "@angular/router";
import { Usuario } from "../interfaces/Usuario.interface";
import { UsuarioRegistro } from "../interfaces/UsuarioRegistro.interface";

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {

    constructor(private _http: HttpClient) {}

    private _isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isAuthenticated = this._isAuthenticated.asObservable();

    login(dados: UsuarioLogin): Observable<any> {
        return this._http.post(APP.api + 'authentication/login', dados);
    }

    register(dados: UsuarioRegistro): Observable<any> {
        return this._http.post(APP.api + 'authentication/register', dados);
    }

    
    setToken(token: string) {
        localStorage.setItem('token', token);
    }

    clearToken() {
        this._isAuthenticated.next(false);
        localStorage.removeItem('token');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getUsuario(): Usuario {
        const decoded: any = Object.assign({}, jwtDecode(this.getToken() ?? ''));
        return {
            id: Number(decoded['id']),
            email: decoded['email'],
            name: decoded['name']
        } as Usuario;
    }

    isLoggedIn(): boolean {

        try {

            const decoded: JwtPayload  = Object.assign({}, jwtDecode(this.getToken() ?? ''));

            console.log('decoded: ', decoded);

            if(decoded && decoded.exp) {
                if (Date.now() >= decoded.exp * 1000) {
                    this._isAuthenticated.next(false);
                    return false;
                } else {
                    this._isAuthenticated.next(true);
                    return true;
                }
            } else {
                this._isAuthenticated.next(false);
                return false;
            }
            
        } catch (err) {
            this._isAuthenticated.next(false);
            return false;
        }

    }

}