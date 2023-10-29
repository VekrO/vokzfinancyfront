import { Component, OnInit, Optional } from "@angular/core";
import { Router } from "@angular/router";

import { BehaviorSubject, lastValueFrom } from "rxjs";
import { Despesa } from "src/app/models/Despesa.model";
import { Usuario } from "src/app/models/Usuario.model";
import { AuthenticationService } from "src/app/services/authentication.service";
import { DespesaService } from "src/app/services/despesa.service";
import { DashboardComponent } from "../../dashboard/dashboard.component";
import { Conta } from "src/app/models/Conta.model";
import { ContaService } from "src/app/services/conta.service";
import { FormControl, FormGroup } from "@angular/forms";
import { FinanceiroFacade } from "../financeiro.facade";
import { MessageService } from "src/app/services/message.service";

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
        this.getDespesasAsync();

    }

    configurarFormulario() {
        this.formularioFiltro = new FormGroup({
            status: new FormControl('todas'),
            ContaId: new FormControl(0),
        });
    }

    getDespesasAsync() {

        console.log('FILTRO: ', this.formularioFiltro.value);

        if(this.formularioFiltro.value.status == 'todas') {
            this.service.getByContaIdAsync(this.formularioFiltro.value.ContaId).subscribe({
                next: (res) => {
                    console.log('res: ', res);
                    
                    this.items.next(res);
                    this.valorTotal = this.items.value.reduce((acumulador, item) => {
                        return acumulador + item.valor;
                    }, 0); 
                },
                error: (err) => {
                    console.log('ERRO: ', err);
                    this.messageService.notify('error', err.error);
                }
            });
        } else if(this.formularioFiltro.value.status == 'vencidos') {

            this.service.getVencidoByContaIdAsync(this.formularioFiltro.value.ContaId).subscribe({
                next: (res) => {
                    this.items.next(res);
                    this.valorTotal = this.items.value.reduce((acumulador, item) => {
                        return acumulador + item.valor;
                    }, 0); 
                },
                error: (err) => {
                    console.log('ERRO: ', err); 
                    this.messageService.notify('error', err.error);
                }
            });
        }
        
    }

    async getContasByUsuario() {

        await this.facade.getContasByUsuario(this.usuario.id).then((contas) => {
            this.contas.next(contas);
            const contaPadrao = contas.find((conta) => conta.padrao);
            if(contaPadrao) {
                this.formularioFiltro.controls['ContaId'].setValue(contaPadrao.id);
            }
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

    marcarPago(item: Despesa, event: MouseEvent) 
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
                console.log('item alterado: ', despesa);
                item = despesa;
                this.processando = false;
            }, 
            error: (err) => {
                this.messageService.notify('error', err.error);
                item.paga = !item.paga;
                this.processando = false;
            }
        });
        
    }

}