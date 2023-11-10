import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { UsuarioRegistro } from "src/app/models/UsuarioRegistro.model";
import { AuthenticationService } from "src/app/services/authentication.service";
import { MessageService } from "src/app/services/message.service";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {

    public formulario!: FormGroup;
    public processando: boolean = false;

    constructor(private service: AuthenticationService, private router: Router, private messageService: MessageService) {}

    ngOnInit(): void {  

        // Verifica se tem token.
        if(this.service.isLoggedIn() && this.service.getRemember()) {
            this.router.navigate(['dashboard']);
            return;
        }

        this.configurarFormulario();

    }

    configurarFormulario() {
        this.formulario = new FormGroup({
            name: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required])
        });
    }
    
    onSubmit() {

        if(this.processando) {
            return;
        }

        this.processando = true;

        const registro = Object.assign({}, this.formulario.value as UsuarioRegistro);

        console.log('registro para enviar: ', registro);

        this.service.register(registro).subscribe({
            next: () => {
                this.router.navigate(['']);
                this.messageService.notify('success', 'Sucesso, você foi redirecionado o login!');
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