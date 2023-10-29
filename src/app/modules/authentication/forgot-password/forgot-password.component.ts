import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { UsuarioPasswordForgot } from "src/app/models/UsuarioPasswordForgot.model";
import { AuthenticationService } from "src/app/services/authentication.service";

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

    public formulario!: FormGroup;
    public processando: boolean = false;
    private reg!: UsuarioPasswordForgot;

    constructor(private service: AuthenticationService, private notifierService: NotifierService, private router: Router) {}

    ngOnInit(): void {
        this.configurarFormulario();
    }

    configurarFormulario() {
        this.formulario = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
        });
    }

    formataRegistro() {
        this.reg = Object.assign({}, this.formulario.value as UsuarioPasswordForgot);
    }

    onSubmit() {

        if(this.processando) {
            return;
        }

        this.processando = true;

        this.formataRegistro();

        this.service.forgotPassword(this.reg).subscribe({
            next: () => {
                this.processando = false;
                this.router.navigate(['']);
                this.notifierService.notify('success', 'Uma mensagem com as informações da troca de senha foi enviada para: ' + this.reg.email);
            },
            error: (err) => {
                console.log('ERRO: ', err);
                this.notifierService.notify('error', err.error);
                this.processando = false;
            }
        });
        
    }

}