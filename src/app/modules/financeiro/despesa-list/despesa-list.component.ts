import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { DespesaList } from "src/app/interfaces/DespesaList.interface";
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
    public items: BehaviorSubject<DespesaList[]> = new BehaviorSubject<DespesaList[]>([]);
    public valorTotal: number = 0;

    constructor(private service: DespesaService, private authService: AuthenticationService, private router: Router) {}
    
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
                console.log('erro: ', err); 
            }
        });

    }

    ver(item: DespesaList) {
        this.router.navigate(['despesa', { id: item.id }])
    }

}