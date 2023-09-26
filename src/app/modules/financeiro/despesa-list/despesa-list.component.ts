import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Despesa } from "src/app/interfaces/Despesa.interface";
import { Usuario } from "src/app/interfaces/Usuario.interface";
import { AuthenticationService } from "src/app/services/authentication.service";
import { DespesaService } from "src/app/services/despesa.service";

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

    constructor(public service: DespesaService, private authService: AuthenticationService, private router: Router) {}
    
    ngOnInit(): void {

        this.usuario = this.authService.getUsuario();

        this.service.getByIdUsuarioAsync(this.usuario.id).subscribe({
            next: (res) => {

                this.items.next(res);
                this.valorTotal = this.items.value.reduce((acumulador, item) => {
                    return acumulador + item.valor;
                }, 0); 
                
            },
            error: (err) => {
                console.log('ERRO: ', err); 
            }
        });

    }

    editar(item: Despesa) {
        this.router.navigate(['despesa', { id: item.id }])
    }

}