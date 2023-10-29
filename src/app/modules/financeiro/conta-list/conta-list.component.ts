import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Conta } from "src/app/models/Conta.model";
import { Usuario } from "src/app/models/Usuario.model";
import { AuthenticationService } from "src/app/services/authentication.service";
import { ContaService } from "src/app/services/conta.service";

@Component({
    selector: 'app-conta-list',
    templateUrl: './conta-list.component.html',
    styleUrls: ['./conta-list.component.css']
})
export class ContaListComponent implements OnInit {

    private usuario!: Usuario;
    public items: BehaviorSubject<Conta[]> = new BehaviorSubject<Conta[]>([]);

    constructor(private service: ContaService, private authService: AuthenticationService, private router: Router) {}

    ngOnInit(): void {

        this.usuario = this.authService.getUsuario();

        if(this.usuario) {
            this.getAllByIdUsuario();
        }

    }

    getAllByIdUsuario() {

        this.service.getAllByIdUsuario(this.usuario.id).subscribe({
            next: (contas: Conta[]) => {
                console.log('contas: ', contas);
                this.items.next(contas);
            },
            error: (err) => {
                console.log('erro: ', err);
            }
        });

    }

    editar(item: Conta, event: MouseEvent) 
    {   
        event.stopPropagation();
        this.router.navigate(['conta', { id: item.id }])
    }

    adicionar() {
        this.router.navigate(['conta']) 
    }

}