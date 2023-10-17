import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { ConfirmacaoComponent } from "src/app/components/confirmacao/confirmacao.component";
import { Conta } from "src/app/interfaces/Conta.interface";
import { Usuario } from "src/app/interfaces/Usuario.interface";
import { AuthenticationService } from "src/app/services/authentication.service";
import { ContaService } from "src/app/services/conta.service";
import { ModalService } from "src/app/services/modal.service";

@Component({
    selector: 'app-conta',
    templateUrl: './conta.component.html',
    styleUrls: ['./conta.component.css']
})
export class ContaComponent implements OnInit {

    public formulario!: FormGroup;
    public processando: boolean = false;
    public registro!: Conta;
    private usuario!: Usuario;

    constructor(
        private authService: AuthenticationService,
        private service: ContaService, 
        private route: ActivatedRoute, 
        private location: Location,
        private notifierService: NotifierService,
        private modalService: ModalService
        ) {}

    ngOnInit(): void {

        this.usuario = this.authService.getUsuario();

        this.configurarFormulario();
        this.route.paramMap.subscribe({
            next: (params: ParamMap) => {
                if(params && params.get("id")) {
                    this.getConta(Number(params.get("id")));
                }
            }
        });

    }

    getConta(id: number) {

        if(this.processando) {
            return;
        }

        this.processando = true;

        this.service.get(id).subscribe({
            next: (conta: Conta) => {
                this.registro = conta;
                this.popularFormulario(conta);
                this.processando = false;
            },
            error: (err) => {
                console.log('ERRO: ', err);
                this.processando = false;
            }
        });
    }

    configurarFormulario() {
        
        this.formulario = new FormGroup({
            id: new FormControl(0),
            nome: new FormControl('', [Validators.required]),
            UsuarioId: new FormControl(this.usuario.id),
            padrao: new FormControl(false),
            descricao: new FormControl('', [Validators.required])
        });

    }

    popularFormulario(data: Conta) {
        if(data) {
            this.registro = data;
            this.formulario.patchValue(data);
        }
    }   

    onSubmit() {

        this.registro = Object.assign({}, this.formulario.value as Conta);

        if(!this.registro.id) {
            this.post();
        } else {
            this.put();
        }
        
    }

    post() {

        if(this.processando) {
            return;
        }

        this.processando = true;

        console.log('registro: ', this.registro);
        
        this.service.post(this.registro).subscribe({
            next: (conta: Conta) => {
                console.log('CONTA: ', conta);
                this.popularFormulario(conta);
                this.processando = false;
                this.notifierService.notify('success', 'Nova conta criada!');
            },
            error: (err) => {
                console.log('erro: ', err);
                this.notifierService.notify('error', err.error);
                this.processando = false;
            }
        });

    }
    
    put() {

        if(this.processando) {
            return;
        }
        
        this.processando = true;

        this.service.put(this.registro).subscribe({
            next: (conta: Conta) => {
                console.log('CONTA: ', conta);
                this.popularFormulario(conta);
                this.notifierService.notify('success', 'Conta atualizada com sucesso!');
                this.processando = false;
            },
            error: (err) => {
                console.log('erro: ', err);
                this.notifierService.notify('error', err.error);
                this.processando = false;
            }
        });

    }

    excluir(id: number) {

        console.log('vai excluir: ', this.registro);

        this.modalService.open(ConfirmacaoComponent, {data: {
            id: id,
            message: 'Deseja excluir esse registro de ID: ' + id
        }, title: 'Excluir Registro', width: '50%' }).subscribe({
            next: (res) => {
                if(res && res == 'OK') {
                    this.service.delete(id, this.usuario.id).subscribe({
                        next: (res) => {
                            console.log('resposta cnta: ', res);
                            this.notifierService.notify('success', 'Registro excluído com sucesso!');
                            this.voltar();
                        },
                        error: (err) => {
                            console.log('erro : ', err);
                            this.notifierService.notify('error', err.error);
                        }
                    });
                }
            }
        });

    }
    
    voltar() {
        this.location.back();
    }

}