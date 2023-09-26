import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Receita } from "src/app/interfaces/Receita.interface";
import { Usuario } from "src/app/interfaces/Usuario.interface";
import { AuthenticationService } from "src/app/services/authentication.service";
import { ReceitaService } from "src/app/services/receita.service";

@Component({
    selector: 'app-receita-list',
    templateUrl: './receita-list.component.html',
    styleUrls: ['./receita-list.component.css']
})
export class ReceitaListComponent implements OnInit {


    private usuario!: Usuario;
    public items: BehaviorSubject<Receita[]> = new BehaviorSubject<Receita[]>([]);
    public valorTotal: number = 0;
    public visible: boolean = false;

    constructor(public service: ReceitaService, private authService: AuthenticationService, private router: Router) {}
    
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

    editar(item: Receita) {
        this.router.navigate(['receita', { id: item.id }])
    }

}