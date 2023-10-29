import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { forkJoin } from "rxjs";
import { ConfirmacaoComponent } from "src/app/components/confirmacao/confirmacao.component";
import { Conta } from "src/app/models/Conta.model";
import { Usuario } from "src/app/models/Usuario.model";
import { AuthenticationService } from "src/app/services/authentication.service";
import { ContaService } from "src/app/services/conta.service";
import { ModalService } from "src/app/services/modal.service";
import { UtilService } from "src/app/util.service";

@Component({
    selector: 'app-conta',
    templateUrl: './conta.component.html',
    styleUrls: ['./conta.component.css']
})
export class ContaComponent implements OnInit {

    public formulario!: FormGroup;
    public processando: boolean = false;

    public registro!: Conta;
    public registroOriginal!: Conta;

    private usuario!: Usuario;
    
    public temContaPadrao: boolean = false;

    constructor(
        private authService: AuthenticationService,
        private service: ContaService, 
        private route: ActivatedRoute, 
        private location: Location,
        private notifierService: NotifierService,
        private modalService: ModalService,
        private router: Router,
        private utilService: UtilService
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

        this.service.get(id, this.usuario.id).subscribe({
            next: (conta: Conta) => {
                this.registro = conta;
                this.registroOriginal = this.registro;
                this.popularFormulario(conta);
                this.processando = false;
            },
            error: (err) => {
                console.log('ERRO: ', err);
                this.processando = false;
                this.notifierService.notify('error', err.error);
                this.router.navigate(['contas']);
            }
        });

    }

    configurarFormulario() {
        
        this.formulario = new FormGroup({
            id: new FormControl(0),
            nome: new FormControl('', [Validators.required]),
            UsuarioId: new FormControl(this.usuario.id),
            padrao: new FormControl(false),
            descricao: new FormControl('')
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
                this.temContaPadrao = conta.padrao;
                this.notifierService.notify('success', 'Conta atualizada com sucesso!');
                this.processando = false;
            },
            error: (err) => {
                console.log('erro: ', err);
                this.popularFormulario(this.registroOriginal)
                this.notifierService.notify('error', err.error);
                this.processando = false;
            }
        });

    }

    excluir(id: number) {

        this.modalService.open(ConfirmacaoComponent, {data: {
            id: id,
        }, 
        title: 'Excluir Conta', 
        message: 'Ao confirmar, você vai excluir todas as despesas e receitas vinculadas a mesma!',
        width: this.utilService.isMobile() ? '95%' : '50%' 
        }).subscribe({
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