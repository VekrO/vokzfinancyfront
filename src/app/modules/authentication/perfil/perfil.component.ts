import { UsuarioService } from './../../../services/usuario.service';
import { DynamicDialogRef } from 'src/app/services/dynamicDialogRef.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Component, OnInit } from "@angular/core";
import { Usuario } from "src/app/interfaces/Usuario.interface";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'app-perfil',
    templateUrl: './perfil.component.html',
    styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

    public usuario!: Usuario;
    public formulario!: FormGroup;
    public processando: boolean = false;
    private reg!: Usuario;

    constructor(private authService: AuthenticationService, private dynamicDialogRef: DynamicDialogRef, private usuarioService: UsuarioService, private router: Router, private notifierService: NotifierService) {}

    ngOnInit(): void {
        this.usuario = this.authService.getUsuario();
        this.processando = true;
        this.usuarioService.get(this.usuario.id).subscribe({
            next: (res: Usuario) => {
                this.configurarFormulario();
                this.popularFormulario(res);
                this.processando = false;
            },
            error: (err) => {
                console.log('ERR: ', err);
            }
        });
    }

    configurarFormulario() {
        this.formulario = new FormGroup({
            id: new FormControl(this.usuario.id, [Validators.required]),
            name: new FormControl(this.usuario.name, [Validators.required]),
            email: new FormControl(this.usuario.email, [Validators.required, Validators.email]),
            /* password: new FormControl('', [Validators.required]),
            confirm_password: new FormControl('', [Validators.required]) */
        });
    }

    popularFormulario(data: Usuario) {
        if(data) {
            this.formulario.patchValue(data);
        }
    }
    
    onSubmit() {
        this.formataRegistro();
        this.put();
    }

    formataRegistro() {
        this.reg = Object.assign({}, this.formulario.value as Usuario);
    }

    put() {
        this.usuarioService.patch(this.reg).subscribe({
            next: (res: Usuario) => {
                console.log('ATT: ', res);
                this.voltar();
                this.popularFormulario(res);
                this.authService.clearToken();
                this.notifierService.notify('success', 'Sucesso! entre novamente para atualizar os dados!');
                this.router.navigate(['']);
            },
            error: (err) => {
                console.log('ERR: ', err);
                this.notifierService.notify('error', err.error.message);
            }
        });
    }

    voltar() {
        this.dynamicDialogRef.destroy();
    }

}   