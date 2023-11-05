import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BehaviorSubject } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import { Conta } from 'src/app/models/Conta.model';
import { FinanceiroFacade } from '../financeiro/financeiro.facade';
import { MessageService } from 'src/app/services/message.service';
import { DespesaListComponent } from '../financeiro/despesa-list/despesa-list.component';
import { ReceitaListComponent } from '../financeiro/receita-list/receita-list.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public usuario!: Usuario;

  public receitaAtual: number = 0;
  public despesaAtual: number = 0;
  public saldoAtual: number = 0;
  public cumprimento: string = '';

  public formularioFiltro!: FormGroup;

  public contas: BehaviorSubject<Conta[]> = new BehaviorSubject<Conta[]>([]);

  public contaGrafico: string[] = [];
  public valorDespesas: number[] = [];
  public valorReceitas: number[] = [];

  @ViewChild('despesaList') despesaListComponent!: DespesaListComponent;
  @ViewChild('receitaList') receitaListComponent!: ReceitaListComponent;

  public processando: boolean = false;

  constructor(private authService: AuthenticationService, private usuarioService: UsuarioService, private financeiroFacade: FinanceiroFacade, private messageService: MessageService) {}

  async ngOnInit(): Promise<void> {
    
    this.usuario = this.authService.getUsuario();

    this.configurarFormulario();
    this.getCumprimento();
    await this.getContasByUsuario();
    await this.updateUI();

  }

  async updateUI() {

    if(this.formularioFiltro.value.ContaId == 0) {
      
      // Pega todas as informações das contas reunidas apenas pelo id do usuário.
      this.getValorReceitasByIdUsuarioAsync();
      this.getValorDespesasByIdUsuarioAsync();

      
    } else {

      // Pega todas as informações da conta selecionada.
      this.getValorReceitasByIdUsuarioAndIdContaAsync();
      this.getValorDespesasByIdUsuarioAndIdContaAsync();

    }

    this.setarDataNoViewChild();

  }
  
  setarDataNoViewChild() {
    if(this.receitaListComponent) {
      this.receitaListComponent.formularioFiltro.controls['dtIni'].setValue(this.formularioFiltro.value.dtIni);
      this.receitaListComponent.formularioFiltro.controls['dtFim'].setValue(this.formularioFiltro.value.dtFim);
    }
    if(this.despesaListComponent) {
      this.despesaListComponent.formularioFiltro.controls['dtIni'].setValue(this.formularioFiltro.value.dtIni);
      this.despesaListComponent.formularioFiltro.controls['dtFim'].setValue(this.formularioFiltro.value.dtFim);
    }
  }

  async getContasByUsuario() {

    await this.financeiroFacade.getContasByUsuario(this.usuario.id).then((contas) => {
        this.contas.next(contas);
        this.formularioFiltro.controls['ContaId'].setValue(0); // Deixa por padrão todas.
    }).catch((err) => {
        console.log('error: ', err);
    });

  }

  configurarFormulario() {
    
    this.formularioFiltro = new FormGroup({
        status: new FormControl('todas'),
        ContaId: new FormControl(0),
        dtIni: new FormControl(),
        dtFim: new FormControl()
    });

  }

  getValorReceitasByIdUsuarioAsync() {
    this.usuarioService.getValorReceitasByIdUsuarioAsync(this.usuario.id, this.formularioFiltro.value.dtIni, this.formularioFiltro.value.dtFim).subscribe({
      next: (valor: number) => {
        this.receitaAtual = valor;
      },
      error: (err) => {
        console.log('ERRO: ', err);
      }
    });
  }

  getValorDespesasByIdUsuarioAsync() {
    this.usuarioService.getValorDespesasByIdUsuarioAsync(this.usuario.id, this.formularioFiltro.value.dtIni, this.formularioFiltro.value.dtFim).subscribe({
      next: (valor: number) => {
        this.despesaAtual = valor;
      },
      error: (err) => {
        console.log('ERRO: ', err);
        this.messageService.notify('error', err.error);
      }
    });
  }

  getValorReceitasByIdUsuarioAndIdContaAsync() {
    this.usuarioService.getValorReceitasByIdUsuarioAndIdContaAsync(this.usuario.id, this.formularioFiltro.value.ContaId, this.formularioFiltro.value.dtIni, this.formularioFiltro.value.dtFim).subscribe({
      next: (valor: number) => {
        this.receitaAtual = valor;
      },
      error: (err) => {
        console.log('ERRO: ', err);
      }
    });
  }

  getValorDespesasByIdUsuarioAndIdContaAsync() {
    this.usuarioService.getValorDespesasByIdUsuarioAndIdContaAsync(this.usuario.id, this.formularioFiltro.value.ContaId, this.formularioFiltro.value.dtIni, this.formularioFiltro.value.dtFim).subscribe({
      next: (valor: number) => {
        this.despesaAtual = valor;
      },
      error: (err) => {
        console.log('ERRO: ', err);
        this.messageService.notify('error', err.error);
      }
    });
  }

  getCumprimento() {

    const horaAtual = moment();
    const horaBomDia = moment('00:00:00', 'HH:mm:ss');
    const horaBoaTarde = moment('12:00:00', 'HH:mm:ss');
    const horaBoaNoite = moment('18:00:00', 'HH:mm:ss');

    if(moment(horaAtual).isAfter(horaBomDia)) { this.cumprimento = 'Bom Dia'}
    if(moment(horaAtual).isAfter(horaBoaTarde)) { this.cumprimento = 'Boa Tarde' }
    if(moment(horaAtual).isAfter(horaBoaNoite)) { this.cumprimento = 'Boa Noite'}

  }

  onDateEvent() {

    console.log('FORMULARIO FILTRO: ', this.formularioFiltro.value);

    this.updateUI();

    if (this.receitaListComponent) {
      this.receitaListComponent.updateUI();
    }
    if (this.despesaListComponent) {
      this.despesaListComponent.updateUI();
    }

  }

  onFormEvent(form: FormGroup) { 
    this.formularioFiltro = form;
  }

  ngOnDestroy(): void {}

}
