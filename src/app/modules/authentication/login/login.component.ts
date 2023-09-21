import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UsuarioLogin } from "src/app/interfaces/UsuarioLogin.interface";
import { UsuarioToken } from "src/app/interfaces/UsuarioToken.interface";
import { AuthenticationService } from "src/app/services/authentication.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    public formulario!: FormGroup;
    public processando: boolean = false;

    constructor(private service: AuthenticationService, private router: Router) {}

    ngOnInit(): void {

        this.configurarFormulario();

    }

    configurarFormulario() {
        this.formulario = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required])
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
                console.log('resposta do login: ', res);
                this.service.setToken(res.token);
                this.router.navigate(['dashboard']);
                this.processando = false;
            },
            error: (err) => {
                console.log('Erro: ', err);
                this.processando = false;
            }
        });
        
    }

}