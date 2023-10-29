export class UsuarioToken {
    authenticated: boolean;
    token: string;
    expiration: Date | string;
    message: string;

    constructor(authenticated: boolean, token: string, expiration: Date | string, message: string) {
        this.authenticated = authenticated;
        this.token = token;
        this.expiration = expiration;
        this.message = message;
    }
}
