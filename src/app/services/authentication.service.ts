import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { UsuarioLogin } from "../models/UsuarioLogin.model";
import { APP } from "src/environments/environment";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { Router } from "@angular/router";
import { Usuario } from "../models/Usuario.model";
import { UsuarioRegistro } from "../models/UsuarioRegistro.model";
import { UsuarioPasswordReset } from "../models/UsuarioPasswordReset.model";
import { UsuarioPasswordForgot } from "../models/UsuarioPasswordForgot.model";

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

    resetPassword(dados: UsuarioPasswordReset): Observable<any> {
        return this._http.post(APP.api + 'authentication/reset-password', dados);
    }

    forgotPassword(dados: UsuarioPasswordForgot): Observable<any> {
        return this._http.post(APP.api + 'authentication/forgot-password', dados);
    }

    verify(token: string): Observable<any> {
        return this._http.post(APP.api + 'authentication/verify?token=' + token, {token: token});
    }

    setToken(token: string) {
        localStorage.setItem('token', token);
    }

    clearToken() {
        this._isAuthenticated.next(false);
        localStorage.removeItem("token"); // Remove todos os itens do localstorage.
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    setRemember(value: boolean) {
        localStorage.setItem("remember", JSON.stringify(value));
    }

    getRemember(): boolean {
        let remember = localStorage.getItem("remember");
        return Boolean(remember);
    }

    removeRemember() {
        localStorage.removeItem("remember");
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