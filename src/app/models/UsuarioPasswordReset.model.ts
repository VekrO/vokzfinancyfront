export class UsuarioPasswordReset {
    token: string;
    password: string;
    passwordConfirm: string;

    constructor(token: string, password: string, passwordConfirm: string) {
        this.token = token;
        this.password = password;
        this.passwordConfirm = passwordConfirm;
    }
}
