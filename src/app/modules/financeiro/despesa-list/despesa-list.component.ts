import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { BehaviorSubject } from "rxjs";
import { Despesa } from "src/app/models/Despesa.model";
import { Usuario } from "src/app/models/Usuario.model";
import { AuthenticationService } from "src/app/services/authentication.service";
import { DespesaService } from "src/app/services/despesa.service";
import { Conta } from "src/app/models/Conta.model";
import { FormControl, FormGroup } from "@angular/forms";
import { FinanceiroFacade } from "../financeiro.facade";
import { MessageService } from "src/app/services/message.service";
import * as moment from "moment";

@Component({
    selector: 'app-despesa-list',
    templateUrl: './despesa-list.component.html',
    styleUrls: ['./despesa-list.component.css']
})
export class DespesaListComponent implements OnInit {


    private usuario!: Usuario;
    public items: BehaviorSubject<Despesa[]> = new BehaviorSubject<Despesa[]>([]);
    public contas: BehaviorSubject<Conta[]> = new BehaviorSubject<Conta[]>([]);
    public valorTotal: number = 0;
    public visible: boolean = false;
    public processando: boolean = false;

    public formularioFiltro!: FormGroup;
    @Input() public showFilter: boolean = true;

    constructor(
        public service: DespesaService, 
        private authService: AuthenticationService, 
        private router: Router,
        private messageService: MessageService,
        private facade: FinanceiroFacade
    ) {}
    
    async ngOnInit(): Promise<void> {

        this.usuario = this.authService.getUsuario();
        
        this.configurarFormulario();
        await this.getContasByUsuario();
        this.updateUI();

    }

    configurarFormulario() {
        this.formularioFiltro = new FormGroup({
            status: new FormControl('todas'),
            ContaId: new FormControl(0),
            dtIni: new FormControl(),
            dtFim: new FormControl()
        });
    }

    getDespesasAsync() {

        console.log('BUSCAR: ', this.formularioFiltro.value);
        
        if(this.processando) {
            return;
        }
        
        this.processando = true;

        if(this.formularioFiltro.value.ContaId == 0) {
            console.log('CONTA ID = 0');
            this.service.getAllByIdUsuarioAsync(this.usuario.id, this.formularioFiltro.value.dtIni, this.formularioFiltro.value.dtFim).subscribe({
                next: (res) => {
                    console.log('DESPESAS: ', res);
                    this.processando = false;
                    this.items.next(res);
                    this.valorTotal = this.items.value.reduce((acumulador, item) => {
                        return acumulador + item.valor;
                    }, 0); 
                }, 
                error: (err) => {
                    console.log('ERRO: ', err);
                    this.processando = false;
                    this.messageService.notify('error', err.error);
                }
            });

            return;
        }

        this.service.getByContaIdAsync(this.formularioFiltro.value.ContaId, this.formularioFiltro.value.dtIni, this.formularioFiltro.value.dtFim).subscribe({
            next: (res) => {
                console.log('DESPESAS: ', res);
                this.processando = false;
                this.items.next(res);
                this.valorTotal = this.items.value.reduce((acumulador, item) => {
                    return acumulador + item.valor;
                }, 0); 
            },
            error: (err) => {
                console.log('ERRO: ', err);
                this.processando = false;
                this.messageService.notify('error', err.error);
            }
        });

    }

    updateUI() {

        this.getDespesasAsync();

    }
 
    async getContasByUsuario() {

        await this.facade.getContasByUsuario(this.usuario.id).then((contas) => {
            this.contas.next(contas);
            /* const contaPadrao = contas.find((conta) => conta.padrao);
            if(contaPadrao) {
                this.formularioFiltro.controls['ContaId'].setValue(contaPadrao.id);
            } */
        }).catch((err) => {
            console.log('error: ', err);
        });

    }

    editar(item: Despesa, event: MouseEvent) 
    {   
        event.stopPropagation();
        this.router.navigate(['despesa', { id: item.id }])
    }

    adicionar() {
        this.router.navigate(['despesa']);
    }

    @Input() set setData(formulario: FormGroup) {
        this.formularioFiltro.controls['dtIni'].setValue(formulario.value.dtIni);
        this.formularioFiltro.controls['dtFim'].setValue(formulario.value.dtFim);
    }

    /* marcarPago(item: Despesa, event: MouseEvent) 
    {       

        console.log('ITEM: ', item);

        if(this.processando) {
            return;
        }
        
        this.processando = true;
        
        event.stopPropagation();
        
        item.paga = !item.paga;

        this.service.put(item).subscribe({
            next: (despesa: Despesa) => {
                item = despesa;
                this.processando = false;
            }, 
            error: (err) => {
                this.messageService.notify('error', err.error);
                item.paga = !item.paga;
                this.processando = false;
            }
        });
        
    } */

}