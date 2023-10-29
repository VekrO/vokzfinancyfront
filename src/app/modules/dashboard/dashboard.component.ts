import { Component, OnDestroy, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BehaviorSubject } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NotifierService } from 'angular-notifier';
import * as moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import { Conta } from 'src/app/models/Conta.model';
import { FinanceiroFacade } from '../financeiro/financeiro.facade';
import Chart from 'chart.js/auto';
import { ReceitaDespesa } from 'src/app/models/ReceitaDespesa.model';

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

  public chart!: Chart;

  public contaGrafico: string[] = [];
  public valorDespesas: number[] = [];
  public valorReceitas: number[] = [];

  constructor(private authService: AuthenticationService, private usuarioService: UsuarioService, private financeiroFacade: FinanceiroFacade, private notifierService: NotifierService) {}

  async ngOnInit(): Promise<void> {
    
    this.usuario = this.authService.getUsuario();

    this.configurarFormulario();
    this.getCumprimento();
    this.initGrafico();
    await this.getContasByUsuario();
    await this.updateUI();

  }

  async updateUI() {

    if(this.formularioFiltro.value.ContaId == 0) {
      
      // Pega todas as informações das contas reunidas apenas pelo id do usuário.
      await this.getValorReceitasByIdUsuarioAsync(),
      await this.getValorDespesasByIdUsuarioAsync(),
      await this.getSaldoByIdUsuarioAsync(),
      await this.getReceitaDespesaByIdUsuario()

      
    } else {

      // Pega todas as informações da conta selecionada.
      await this.getValorReceitasByIdUsuarioAndIdContaAsync(),
      await this.getValorDespesasByIdUsuarioAndIdContaAsync(),
      await this.getSaldoByIdUsuarioAndIdContaAsync(),
      await this.getReceitaDespesaByIdConta()

    }

  }

  initGrafico() {

    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: this.contaGrafico,
        datasets: [
          {
            label: 'Despesas',
            data: this.valorDespesas,
            borderWidth: 1,
            backgroundColor: 'rgba(255, 0, 0, 0.5)', // Cor das barras de despesas
          },
          {
            label: 'Receitas',
            data: this.valorReceitas,
            borderWidth: 1,
            backgroundColor: 'rgba(75, 192, 192, 0.5)', // Cor das barras de receitas
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: {
            display: true,
            beginAtZero: true,
            max: 5000
          },
        },
      },
    });
    
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

  async getReceitaDespesaByIdConta() {
    await this.financeiroFacade.getReceitaDespesaByIdConta(this.formularioFiltro.value.ContaId).then((valores: ReceitaDespesa) => {
      console.log('valores: ', valores);
      
      if(this.chart) {
        this.chart.data.labels = [valores.conta.nome];
        this.chart.data.datasets = [
          {
            label: 'Despesas',
            data: [valores.valorDespesa],
            borderWidth: 1,
            backgroundColor: 'rgba(255, 0, 0, 0.5)', // Cor das barras de despesas
          },
          {
            label: 'Receitas',
            data: [valores.valorReceita],
            borderWidth: 1,
            backgroundColor: 'rgba(75, 192, 192, 0.5)', // Cor das barras de receitas
          },
        ]
        
        this.chart.update();

      }

    }).catch((err) => {
      console.log('error: ', err);
    });
  }

  async getReceitaDespesaByIdUsuario() {
    await this.financeiroFacade.getReceitaDespesaByUsuario(this.usuario.id).then((valores: ReceitaDespesa) => {
      console.log('valores: ', valores);
      
      if(this.chart) {
        this.chart.data.labels = [valores.conta.nome];
        this.chart.data.datasets = [
          {
            label: 'Despesas',
            data: [valores.valorDespesa],
            borderWidth: 1,
            backgroundColor: 'rgba(255, 0, 0, 0.5)', // Cor das barras de despesas
          },
          {
            label: 'Receitas',
            data: [valores.valorReceita],
            borderWidth: 1,
            backgroundColor: 'rgba(75, 192, 192, 0.5)', // Cor das barras de receitas
          },
        ]
        
        this.chart.update();

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

  getValorReceitasByIdUsuarioAsync(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.usuarioService.getValorReceitasByIdUsuarioAsync(this.usuario.id).subscribe({
        next: (valor: number) => {
          this.receitaAtual = valor;
          resolve();
        },
        error: (err) => {
          console.log('ERRO: ', err);
          reject();
        }
      });
    })
  }

  getValorDespesasByIdUsuarioAsync(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.usuarioService.getValorDespesasByIdUsuarioAsync(this.usuario.id).subscribe({
        next: (valor: number) => {
          this.despesaAtual = valor;
          resolve();
        },
        error: (err) => {
          console.log('ERRO: ', err);
          this.notifierService.notify('error', err.error);
          reject();
        }
      });
    })
  }

  getValorReceitasByIdUsuarioAndIdContaAsync(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.usuarioService.getValorReceitasByIdUsuarioAndIdContaAsync(this.usuario.id, this.formularioFiltro.value.ContaId).subscribe({
        next: (valor: number) => {
          this.receitaAtual = valor;
          resolve();
        },
        error: (err) => {
          console.log('ERRO: ', err);
          reject();
        }
      });
    })
  }

  getValorDespesasByIdUsuarioAndIdContaAsync(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.usuarioService.getValorDespesasByIdUsuarioAndIdContaAsync(this.usuario.id, this.formularioFiltro.value.ContaId).subscribe({
        next: (valor: number) => {
          this.despesaAtual = valor;
          resolve();
        },
        error: (err) => {
          console.log('ERRO: ', err);
          this.notifierService.notify('error', err.error);
          reject();
        }
      });
    })
  }

  getSaldoByIdUsuarioAsync(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.usuarioService.getSaldoByIdUsuarioAsync(this.usuario.id).subscribe({
        next: (valor: number) => {
          this.saldoAtual = valor;
          resolve();
        },
        error: (err) => {
          console.log('ERRO: ', err);
          this.notifierService.notify('error', err.error);
          reject();
        }
      });
    });
  }

  getSaldoByIdUsuarioAndIdContaAsync(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.usuarioService.getSaldoByIdUsuarioAndIdContaAsync(this.usuario.id, this.formularioFiltro.value.ContaId).subscribe({
        next: (valor: number) => {
          this.saldoAtual = valor;
          resolve();
        },
        error: (err) => {
          console.log('ERRO: ', err);
          this.notifierService.notify('error', err.error);
          reject();
        }
      });
    })
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

  ngOnDestroy(): void {
  }

}
