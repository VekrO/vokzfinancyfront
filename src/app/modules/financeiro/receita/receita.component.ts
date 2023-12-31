import { CurrencyPipe, Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";

import * as moment from "moment";
import { BehaviorSubject } from "rxjs";
import { ConfirmacaoComponent } from "src/app/components/confirmacao/confirmacao.component";
import { Conta } from "src/app/models/Conta.model";
import { Receita } from "src/app/models/Receita.model";
import { Usuario } from "src/app/models/Usuario.model";
import { AuthenticationService } from "src/app/services/authentication.service";
import { ContaService } from "src/app/services/conta.service";
import { ModalService } from "src/app/services/modal.service";
import { ReceitaService } from "src/app/services/receita.service";
import { UtilService } from "src/app/util.service";
import { FinanceiroFacade } from "../financeiro.facade";
import { MessageService } from "src/app/services/message.service";

@Component({
    selector: 'app-receita',
    templateUrl: './receita.component.html',
    styleUrls: ['./receita.component.css'],
    providers: [CurrencyPipe]
})
export class ReceitaComponent implements OnInit {

    public formulario!: FormGroup;
    public registro!: Receita;
    public processando: boolean = false;
    public contas: BehaviorSubject<Conta[]> = new BehaviorSubject<Conta[]>([]);

    private usuario!: Usuario;

    constructor(
        public utilService: UtilService, 
        private service: ReceitaService, 
        private location: Location, 
        private facade: FinanceiroFacade,
        private route: ActivatedRoute, 
        private authService: AuthenticationService,
        private modalService: ModalService,
        private messageService: MessageService,
        private router: Router
        ) {}

    ngOnInit(): void {

        this.usuario = this.authService.getUsuario();

        this.configurarFormulario();
        this.getContasByUsuario();
        
        this.route.paramMap.subscribe({
            next: (params: ParamMap) => {
                if(params && params.get("id")) {
                    this.getReceita(Number(params.get("id")));
                }
            }
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
            data: new FormControl('', [Validators.required])
        });

    }

    popularFormulario(data: Receita) {
        if(data) {
            this.registro = data;
            if(moment(data.data).isValid()) {
                data.data = moment(data.data).format('YYYY-MM-DD');
            }
            this.formulario.patchValue(data);
        }
    }

    getReceita(id: number) {

        if(this.processando) {
            return;
        }

        this.processando = true;

        this.service.getByIdAsync(id, this.usuario.id).subscribe({
            next: (receita: Receita) => {
                this.popularFormulario(receita);
                this.processando = false;
            },
            error: (err) => {
                console.log('ERRO: ', err);
                this.processando = false;
                this.messageService.notify('error', err.error);
                this.router.navigate(['receitas']);
            }
        });

    }

    getContasByUsuario() {

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
    
    onSubmit() {
        this.registro = Object.assign({}, this.formulario.value as Receita);
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
            next: (receita: Receita) => {
                this.messageService.notify('success', 'Receita criada com sucesso!');
                this.popularFormulario(receita);
                this.processando = false;
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
            next: (Receita: Receita) => {
                this.messageService.notify('success', 'Receita atualizada com sucesso!');
                this.popularFormulario(Receita);
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