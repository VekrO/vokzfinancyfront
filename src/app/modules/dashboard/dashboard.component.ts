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
    this.getCumprimento();
    this.getValorReceita(this.usuario.id)
    this.getValorDespesa(this.usuario.id);
    this.getSaldoAtual(this.usuario.id);

  }

  getValorReceita(idUsuario: number) {
    this.receitaService.getValorByIdUsuarioAsync(idUsuario).subscribe({
      next: (valor: number) => {
        this.receitaAtual = valor;
      },
      error: (err) => {
        console.log('ERRO: ', err);
      }
    });
  }

  getValorDespesa(idUsuario: number) {
    this.despesaService.getValorByIdUsuarioAsync(idUsuario).subscribe({
      next: (valor: number) => {
        this.despesaAtual = valor;
      },
      error: (err) => {
        console.log('ERRO: ', err);
        this.notifierService.notify('error', err.error);
      }
    });
  }

  getSaldoAtual(idUsuario: number) {
    this.usuarioService.getSaldoAtual(idUsuario).subscribe({
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
