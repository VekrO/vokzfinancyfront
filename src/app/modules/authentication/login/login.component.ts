import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UsuarioLogin } from "src/app/models/UsuarioLogin.model";
import { UsuarioToken } from "src/app/models/UsuarioToken.model";
import { AuthenticationService } from "src/app/services/authentication.service";
import { MessageService } from "src/app/services/message.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    public formulario!: FormGroup;
    public processando: boolean = false;

    constructor(private service: AuthenticationService, private router: Router, private messageService: MessageService) {}

    ngOnInit(): void {

        // Verifica se tem token.
        console.log('remember value: ', this.service.getRemember());
        
        if(this.service.isLoggedIn() && this.service.getRemember()) {
            this.router.navigate(['dashboard']);
            return;
        }

        this.configurarFormulario();

    }

    configurarFormulario() {
        this.formulario = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required]),
            remember: new FormControl(false),
        });
    }
    
    onSubmit() {

        if(this.processando) {
            return;
        }

        this.processando = true;

        const registro = Object.assign({}, this.formulario.value as UsuarioLogin);

        this.service.login(registro).subscribe({
            next: (res: UsuarioToken) => {

                if(this.formulario.value.remember) {
                    localStorage.setItem("remember", JSON.stringify(this.formulario.value.remember));
                }

                this.service.setToken(res.token);
                this.router.navigate(['dashboard']);
                this.messageService.notify('success', 'Sucesso, você foi redirecionado!');
                this.processando = false;
            },
            error: (err) => {
                console.log('Erro: ', err);
                this.messageService.notify('error', err.error);
                this.processando = false;
            }
        });
        
    }

}