import { CurrencyPipe, Location } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, FormControlStatus } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import * as moment from "moment";
import { Receita } from "src/app/interfaces/Receita.interface";
import { Usuario } from "src/app/interfaces/Usuario.interface";
import { AuthenticationService } from "src/app/services/authentication.service";
import { ReceitaService } from "src/app/services/receita.service";
import { UtilService } from "src/app/util.service";

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

    private usuario!: Usuario;

    constructor(
        public utilService: UtilService, 
        private service: ReceitaService, 
        private location: Location, 
        private route: ActivatedRoute, 
        private authService: AuthenticationService
        ) {}

    ngOnInit(): void {

        this.usuario = this.authService.getUsuario();
        console.log('usuario: ', this.usuario);

        this.configurarFormulario();
        
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
            usuarioId: new FormControl(this.usuario.id, [Validators.required]),
            titulo: new FormControl('', [Validators.required]),
            descricao: new FormControl(''),
            valor: new FormControl(0, [Validators.required]),
            data: new FormControl('', [Validators.required])
        });

    }

    popularFormulario(data: Receita) {
        if(data) {
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

        this.service.getByIdAsync(id).subscribe({
            next: (Receita: Receita) => {
                this.popularFormulario(Receita);
                this.processando = false;
            },
            error: (err) => {
                console.log('ERRO: ', err);
                this.processando = false;
            }
        });

    }

    
    onSubmit() {
        this.registro = Object.assign({}, this.formulario.value as Receita);
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
            next: (receita: Receita) => {
                console.log('receita: ', receita);
                this.popularFormulario(receita);
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
            next: (Receita: Receita) => {
                console.log('Receita: ', Receita);
                this.popularFormulario(Receita);
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