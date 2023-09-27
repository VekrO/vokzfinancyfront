import { Component, OnInit, Optional } from "@angular/core";
import { Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { BehaviorSubject } from "rxjs";
import { Despesa } from "src/app/interfaces/Despesa.interface";
import { Usuario } from "src/app/interfaces/Usuario.interface";
import { AuthenticationService } from "src/app/services/authentication.service";
import { DespesaService } from "src/app/services/despesa.service";
import { DashboardComponent } from "../../dashboard/dashboard.component";

@Component({
    selector: 'app-despesa-list',
    templateUrl: './despesa-list.component.html',
    styleUrls: ['./despesa-list.component.css']
})
export class DespesaListComponent implements OnInit {


    private usuario!: Usuario;
    public items: BehaviorSubject<Despesa[]> = new BehaviorSubject<Despesa[]>([]);
    public valorTotal: number = 0;
    public visible: boolean = false;
    public processando: boolean = false;

    public filtro: string = 'todas';

    constructor(
        public service: DespesaService, 
        private authService: AuthenticationService, 
        private router: Router,
        private notifierService: NotifierService,
        @Optional() private dashboardComponent: DashboardComponent
    ) {}
    
    ngOnInit(): void {

        this.usuario = this.authService.getUsuario();
        this.getDespesasAsync();

    }

    getDespesasAsync() {
        if(this.filtro == 'todas') {
            this.service.getByIdUsuarioAsync(this.usuario.id).subscribe({
                next: (res) => {
                    this.items.next(res);
                    this.valorTotal = this.items.value.reduce((acumulador, item) => {
                        return acumulador + item.valor;
                    }, 0); 
                },
                error: (err) => {
                    console.log('ERRO: ', err);
                    this.notifierService.notify('error', err.error.message);
                }
            });
        } else if(this.filtro == 'vencidos') {
            this.service.getVencidoByIdUsuarioAsync(this.usuario.id).subscribe({
                next: (res) => {
                    this.items.next(res);
                    this.valorTotal = this.items.value.reduce((acumulador, item) => {
                        return acumulador + item.valor;
                    }, 0); 
                },
                error: (err) => {
                    console.log('ERRO: ', err); 
                    this.notifierService.notify('error', err.error.message);
                }
            });
        }
    }


    editar(item: Despesa, event: MouseEvent) 
    {   
        event.stopPropagation();
        this.router.navigate(['despesa', { id: item.id }])
    }

    marcarPago(item: Despesa, event: MouseEvent) 
    {       

        if(this.processando) {
            return;
        }
        
        this.processando = true;
        
        event.stopPropagation();
        item.paga = !item.paga;
        this.service.update(item).subscribe({
            next: (despesa: Despesa) => {
                console.log('item alterado: ', despesa);
                if(this.dashboardComponent) {
                    this.dashboardComponent.getSaldoAtual(this.usuario.id);
                }
                item = despesa;
                this.processando = false;
            }, 
            error: (err) => {
                this.notifierService.notify('error', err.error.message);
                item.paga = !item.paga;
                this.processando = false;
            }
        });
        
    }

}