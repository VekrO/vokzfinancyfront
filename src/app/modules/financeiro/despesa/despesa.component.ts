import { CurrencyPipe, Location } from "@angular/common";
import { ChangeDetectorRef, Component, Inject, Injectable, Input, OnInit, Optional } from "@angular/core";
import { FormGroup, FormControl, Validators, FormControlStatus } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";

import * as moment from "moment";
import { BehaviorSubject } from "rxjs";
import { ConfirmacaoComponent } from "src/app/components/confirmacao/confirmacao.component";
import { ModalComponent } from "src/app/components/modal/modal.component";
import { Conta } from "src/app/models/Conta.model";
import { Despesa } from "src/app/models/Despesa.model";
import { Usuario } from "src/app/models/Usuario.model";
import { AuthenticationService } from "src/app/services/authentication.service";
import { ContaService } from "src/app/services/conta.service";
import { DespesaService } from "src/app/services/despesa.service";
import { DynamicDialogConfig } from "src/app/services/dynamicDialog.service";
import { ModalService } from "src/app/services/modal.service";
import { UtilService } from "src/app/util.service";
import { FinanceiroFacade } from "../financeiro.facade";
import { MessageService } from "src/app/services/message.service";

@Component({
    selector: 'app-despesa',
    templateUrl: './despesa.component.html',
    styleUrls: ['./despesa.component.css'],
    providers: [CurrencyPipe]
})
export class DespesaComponent implements OnInit {

    public formulario!: FormGroup;
    public registro!: Despesa;
    public processando: boolean = false;
    public contas: BehaviorSubject<Conta[]> = new BehaviorSubject<Conta[]>([]);

    private usuario!: Usuario;

    constructor(
        public utilService: UtilService, 
        private service: DespesaService, 
        private location: Location, 
        private route: ActivatedRoute, 
        private authService: AuthenticationService,
        private messageService: MessageService,
        private modalService: ModalService,
        private contaService: ContaService,
        private facade: FinanceiroFacade,
        private config: DynamicDialogConfig,
        private router: Router
    ) {}

    ngOnInit(): void {

        this.usuario = this.authService.getUsuario();
        
        this.configurarFormulario();
        this.getContasByUsuario();
        
        this.route.paramMap.subscribe({
            next: (params: ParamMap) => {
                if(params && params.get("id")) {
                    this.getDespesa(Number(params.get("id")));
                }
            }
        });

    }

    getContasByIdUsuario() {
        this.facade.getContasByUsuario(this.usuario.id).then((contas) => {
            this.contas.next(contas);
            const contaPadrao = contas.find((conta) => conta.padrao);
            if(contaPadrao) {
            this.formulario.controls['ContaId'].setValue(contaPadrao.id);
            }
        }).catch((err) => {
            console.log('error: ', err);
        });
    }

    configurarFormulario() {
        
        this.formulario = new FormGroup({
            id: new FormControl(0),
            ContaId: new FormControl(0, [Validators.required]),
            titulo: new FormControl('', [Validators.required]),
            descricao: new FormControl(''),
            valor: new FormControl(0, [Validators.required]),
            paga: new FormControl(false, [Validators.required]),
            vencimento: new FormControl('', [Validators.required])
        });

    }

    popularFormulario(data: Despesa) {
        if(data) {
            this.registro = data;
            if(moment(data.vencimento).isValid()) {
                data.vencimento = moment(data.vencimento).format('YYYY-MM-DD');
            }
            this.formulario.patchValue(data);
        }
    }

    getContasByUsuario() {

        this.contaService.getAllByIdUsuario(this.usuario.id).subscribe({
            next: (contas) => {
                console.log('CONTAS: ', contas);
                this.contas.next(contas);
                this.formulario.controls['ContaId'].setValue(contas[0].id);
            },
            error: (err) => {
                console.log('ERRO: ', err);
            }
        });

    }

    getDespesa(id: number) {

        if(this.processando) {
            return;
        }

        this.processando = true;

        this.service.getByIdAsync(id, this.usuario.id).subscribe({
            next: (despesa: Despesa) => {
                this.popularFormulario(despesa);
                this.processando = false;
            },
            error: (err) => {
                console.log('ERRO: ', err);
                this.processando = false;
                this.messageService.notify('error', err.error);
                this.router.navigate(['despesas']);
            }
        });

    }

    
    onSubmit() {
        this.registro = Object.assign({}, this.formulario.value as Despesa);
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
            next: (despesa: Despesa) => {
                console.log('DESPESA: ', despesa);
                this.popularFormulario(despesa);
                this.processando = false;
                this.messageService.notify('success', 'Nova despesa criada!');
            },
            error: (err) => {
                console.log('erro: ', err);
                this.messageService.notify('error', err.error);
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
            next: (despesa: Despesa) => {
                console.log('DESPESA: ', despesa);
                this.popularFormulario(despesa);
                this.messageService.notify('success', 'Despesa atualizada com sucesso!');
                this.processando = false;
            },
            error: (err) => {
                console.log('erro: ', err);
                this.messageService.notify('error', err.error);
                this.processando = false;
            }
        });

    }

    excluir(id: number) {

        this.modalService.open(ConfirmacaoComponent, {data: {
            id: id,
            message: 'Deseja excluir esse registro de ID: ' + id
        }, title: 'Excluir Registro', width: this.utilService.isMobile() ? '95%' : '50%' }).subscribe({
            next: (res) => {
                if(res && res == 'OK') {
                    this.service.delete(id, this.registro.contaId).subscribe({
                        next: () => {
                            this.messageService.notify('success', 'Registro excluído com sucesso!');
                            this.voltar();
                        },
                        error: (err) => {
                            console.log('erro : ', err);
                            this.messageService.notify('error', err.error);
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