import { Component, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Conta } from "src/app/models/Conta.model";
import { Receita } from "src/app/models/Receita.model";
import { Usuario } from "src/app/models/Usuario.model";
import { AuthenticationService } from "src/app/services/authentication.service";
import { ReceitaService } from "src/app/services/receita.service";
import { FinanceiroFacade } from "../financeiro.facade";
import * as moment from "moment";

@Component({
    selector: 'app-receita-list',
    templateUrl: './receita-list.component.html',
    styleUrls: ['./receita-list.component.css']
})
export class ReceitaListComponent implements OnInit {


    private usuario!: Usuario;
    public items: BehaviorSubject<Receita[]> = new BehaviorSubject<Receita[]>([]);
    public contas: BehaviorSubject<Conta[]> = new BehaviorSubject<Conta[]>([]);
    public valorTotal: number = 0;
    public visible: boolean = false;

    @Input() public formularioFiltro!: FormGroup;
    @Input() public showFilter: boolean = true;

    public processando: boolean = false;

    constructor(
        public service: ReceitaService, 
        private authService: AuthenticationService, 
        private facade: FinanceiroFacade,
        private router: Router) {}
    
    async ngOnInit(): Promise<void> {

        this.usuario = this.authService.getUsuario();
        
        if(!this.formularioFiltro) {
            this.configurarFormulario();
        }

        await this.getContasByUsuario();        
        this.updateUI();

    }

    getByIdContaAsync() {

        if(this.processando) {
            return;
        }
        
        this.processando = true;

        this.service.getByContaIdAsync(this.formularioFiltro.value.ContaId, this.formularioFiltro.value.dtIni, this.formularioFiltro.value.dtFim).subscribe({
            next: (res) => {
                this.processando = false;
                this.items.next(res);
                this.valorTotal = this.items.value.reduce((acumulador, item) => {
                    return acumulador + item.valor;
                }, 0);
            },
            error: (err) => {
                this.processando = false;
                console.log('ERRO: ', err); 
            }
        });
    }

    updateUI() {

        this.getByIdContaAsync();
        
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

    configurarFormulario() {
        this.formularioFiltro = new FormGroup({
            ContaId: new FormControl(0),
        });
    }

    editar(item: Receita) {
        this.router.navigate(['receita', { id: item.id }])
    }
    
    adicionar() {
        this.router.navigate(['receita']);
    }

}