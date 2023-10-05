import { ReceitaService } from 'src/app/services/receita.service';
import { DespesaService } from 'src/app/services/despesa.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/Usuario.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BehaviorSubject } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NotifierService } from 'angular-notifier';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public usuario!: Usuario;

  public receitaAtual: number = 0;
  public despesaAtual: number = 0;
  public saldoAtual: BehaviorSubject<number> = new BehaviorSubject(0);
  public cumprimento: string = '';

  constructor(private authService: AuthenticationService, private usuarioService: UsuarioService, private receitaService: ReceitaService, private despesaService: DespesaService, private notifierService: NotifierService) {}

  ngOnInit(): void {
    
    this.usuario = this.authService.getUsuario();
    console.log('USUARIO: ', this.usuario);

    this.getCumprimento();

  }

  getValorReceita(idConta: number) {
    this.receitaService.getValorByIdContaAsync(idConta).subscribe({
      next: (valor: number) => {
        this.receitaAtual = valor;
      },
      error: (err) => {
        console.log('ERRO: ', err);
      }
    });
  }

  getValorDespesa(idConta: number) {
    this.despesaService.getValorByIdContaAsync(idConta).subscribe({
      next: (valor: number) => {
        this.despesaAtual = valor;
      },
      error: (err) => {
        console.log('ERRO: ', err);
        this.notifierService.notify('error', err.error);
      }
    });
  }

  getSaldoAtual(idConta: number) {
    this.usuarioService.getSaldoAtual(idConta).subscribe({
      next: (valor: number) => {
        console.log('saldo atual : ', valor);
        this.saldoAtual.next(valor);
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
