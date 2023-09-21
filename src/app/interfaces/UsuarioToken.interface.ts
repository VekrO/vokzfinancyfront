export interface UsuarioToken {
    authenticated: boolean;
    token: string;
    expiration: Date | string;
    message: string;
}