import { CurrencyPipe, Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import * as moment from "moment";
import { Despesa } from "src/app/interfaces/Despesa.interface";
import { Usuario } from "src/app/interfaces/Usuario.interface";
import { AuthenticationService } from "src/app/services/authentication.service";
import { DespesaService } from "src/app/services/despesa.service";
import { UtilService } from "src/app/util.service";

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

    private usuario!: Usuario;

    constructor(public utilService: UtilService, private service: DespesaService, private location: Location, private route: ActivatedRoute, private authService: AuthenticationService) {}

    ngOnInit(): void {

        this.usuario = this.authService.getUsuario();
        console.log('usuario: ', this.usuario);

        this.configurarFormulario();
        
        this.route.paramMap.subscribe({
            next: (params: ParamMap) => {
                if(params && params.get("id")) {
                    this.getDespesa(Number(params.get("id")));
                }
            }
        });

    }

    configurarFormulario() {
        this.formulario = new FormGroup({
            id: new FormControl(0, [Validators.required]),
            usuarioId: new FormControl(this.usuario.id, [Validators.required]),
            titulo: new FormControl('', [Validators.required]),
            descricao: new FormControl(''),
            valor: new FormControl(0, [Validators.required]),
            vencimento: new FormControl('', [Validators.required])
        });
    }

    popularFormulario(data: Despesa) {
        if(data) {
            if(moment(data.vencimento).isValid()) {
                data.vencimento = moment(data.vencimento).format('YYYY-MM-DD');
            }
            this.formulario.patchValue(data);
        }
    }

    getDespesa(id: number) {

        if(this.processando) {
            return;
        }

        this.processando = true;

        this.service.getByIdAsync(id).subscribe({
            next: (despesa: Despesa) => {
                this.popularFormulario(despesa);
                this.processando = false;
            },
            error: (err) => {
                console.log('ERRO: ', err);
                this.processando = false;
            }
        });

    }

    
    onSubmit() {
        this.registro = Object.assign({}, this.formulario.value as Despesa);
        if(!this.registro.id) {
            this.insert();
        } else {
            this.update();
        }
    }

    insert() {

        if(this.processando) {
            return;
        }

        this.processando = true;

        this.service.insert(this.registro).subscribe({
            next: (despesa: Despesa) => {
                console.log('DESPESA: ', despesa);
                this.popularFormulario(despesa);
                this.processando = false;
            },
            error: (err) => {
                console.log('erro: ', err);
                this.processando = false;
            }
        });

    }

    update() {

        if(this.processando) {
            return;
        }

        this.processando = true;

        this.service.update(this.registro).subscribe({
            next: (despesa: Despesa) => {
                console.log('DESPESA: ', despesa);
                this.popularFormulario(despesa);
                this.processando = false;
            },
            error: (err) => {
                console.log('erro: ', err);
                this.processando = false;
            }
        });

    }
    
    voltar() {
        this.location.back();
    }

}