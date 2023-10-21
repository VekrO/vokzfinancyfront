import { ReceitaService } from 'src/app/services/receita.service';
import { DespesaService } from 'src/app/services/despesa.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/Usuario.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BehaviorSubject } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NotifierService } from 'angular-notifier';
import * as moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import { Conta } from 'src/app/interfaces/Conta.interface';
import { FinanceiroFacade } from '../financeiro/financeiro.facade';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public usuario!: Usuario;

  public receitaAtual: number = 0;
  public despesaAtual: number = 0;
  public saldoAtual: number = 0;
  public cumprimento: string = '';

  public formularioFiltro!: FormGroup;

  public contas: BehaviorSubject<Conta[]> = new BehaviorSubject<Conta[]>([]);

  constructor(private authService: AuthenticationService, private usuarioService: UsuarioService, private financeiroFacade: FinanceiroFacade, private notifierService: NotifierService) {}

  async ngOnInit(): Promise<void> {
    
    this.usuario = this.authService.getUsuario();

    this.configurarFormulario();
    this.getCumprimento();
    await this.getContasByUsuario();
    this.updateUI();
    
  }

  updateUI() {

    if(this.formularioFiltro.value.ContaId == 0) {
      
      // Pega todas as informações das contas reunidas apenas pelo id do usuário.
      this.getValorReceitasByIdUsuarioAsync();
      this.getValorDespesasByIdUsuarioAsync();
      this.getSaldoByIdUsuarioAsync();

    } else {

      // Pega todas as informações da conta selecionada.
      this.getValorReceitasByIdUsuarioAndIdContaAsync();
      this.getValorDespesasByIdUsuarioAndIdContaAsync();
      this.getSaldoByIdUsuarioAndIdContaAsync();

    }

  }

  async getContasByUsuario() {

    await this.financeiroFacade.getContasByUsuario(this.usuario.id).then((contas) => {
        
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
        status: new FormControl('todas'),
        ContaId: new FormControl(0),
    });
  }

  getValorReceitasByIdUsuarioAsync() {
    this.usuarioService.getValorReceitasByIdUsuarioAsync(this.usuario.id).subscribe({
      next: (valor: number) => {
        this.receitaAtual = valor;
      },
      error: (err) => {
        console.log('ERRO: ', err);
      }
    });
  }

  getValorDespesasByIdUsuarioAsync() {
    this.usuarioService.getValorDespesasByIdUsuarioAsync(this.usuario.id).subscribe({
      next: (valor: number) => {
        this.despesaAtual = valor;
      },
      error: (err) => {
        console.log('ERRO: ', err);
        this.notifierService.notify('error', err.error);
      }
    });
  }

  getValorReceitasByIdUsuarioAndIdContaAsync() {
    this.usuarioService.getValorReceitasByIdUsuarioAndIdContaAsync(this.usuario.id, this.formularioFiltro.value.ContaId).subscribe({
      next: (valor: number) => {
        this.receitaAtual = valor;
      },
      error: (err) => {
        console.log('ERRO: ', err);
      }
    });
  }

  getValorDespesasByIdUsuarioAndIdContaAsync() {
    this.usuarioService.getValorDespesasByIdUsuarioAndIdContaAsync(this.usuario.id, this.formularioFiltro.value.ContaId).subscribe({
      next: (valor: number) => {
        this.despesaAtual = valor;
      },
      error: (err) => {
        console.log('ERRO: ', err);
        this.notifierService.notify('error', err.error);
      }
    });
  }

  getSaldoByIdUsuarioAsync() {
    this.usuarioService.getSaldoByIdUsuarioAsync(this.usuario.id).subscribe({
      next: (valor: number) => {
        this.saldoAtual = valor;
      },
      error: (err) => {
        console.log('ERRO: ', err);
        this.notifierService.notify('error', err.error);
      }
    });
  }

  getSaldoByIdUsuarioAndIdContaAsync() {
    this.usuarioService.getSaldoByIdUsuarioAndIdContaAsync(this.usuario.id, this.formularioFiltro.value.ContaId).subscribe({
      next: (valor: number) => {
        this.saldoAtual = valor;
      },
      error: (err) => {
        console.log('ERRO: ', err);
        this.notifierService.notify('error', err.error);
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

}
