import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UsuarioPasswordReset } from "src/app/models/UsuarioPasswordReset.model";
import { AuthenticationService } from "src/app/services/authentication.service";
import { MessageService } from "src/app/services/message.service";

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

    public formulario!: FormGroup;
    public processando: boolean = false;
    private reg!: UsuarioPasswordReset;

    constructor(private service: AuthenticationService, private router: Router, private route: ActivatedRoute, private messageService: MessageService) {}

    ngOnInit(): void {

        if(!this.route.snapshot.queryParamMap.get("token")) {
            this.router.navigate(['']);
            this.messageService.notify('error', 'Por favor, informe um token para alteração de senha!');
            return;
        }

        this.configurarFormulario();
    
    }

    configurarFormulario() {
        this.formulario = new FormGroup({
            token: new FormControl(''),
            password: new FormControl('', [Validators.required]),
            passwordConfirm: new FormControl('', [Validators.required]),
        }, {
            validators: this.passwordValidator
        });
    }

    passwordValidator(control: AbstractControl) {

        const password = control.get('password');
        const passwordConfirm = control.get('passwordConfirm');

        if (!password || !passwordConfirm) {
            return null;
        }

        return password.value === passwordConfirm.value ? null : { 'passwordMismatch': true };

    }

    formataRegistro() {
        this.reg = Object.assign({}, this.formulario.value as UsuarioPasswordReset);
        this.reg.token = this.route.snapshot.queryParamMap.get("token") ?? '';
    }

    onSubmit() {

        if(this.processando) {
            return;
        }

        this.processando = true;

        this.formataRegistro();

        this.service.resetPassword(this.reg).subscribe({
            next: (res) => {
                console.log('RESETOU A SENHA COM SUCESSO: ', res);
                this.router.navigate(['']);
                this.messageService.notify('success', 'Senha alterada com sucesso, faça login novamente!');
                this.processando = false;
            },
            error: (err) => {
                console.log('ERRO: ', err);
                this.messageService.notify('error', err.error);
                this.processando = false;
            }
        });
        
    }

}