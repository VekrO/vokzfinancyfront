import { Component, EventEmitter, Input, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { DespesaListComponent } from 'src/app/modules/financeiro/despesa-list/despesa-list.component';
import { ReceitaListComponent } from 'src/app/modules/financeiro/receita-list/receita-list.component';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.css']
})
export class DateFilterComponent implements OnInit {

  @Input() public formulario!: FormGroup;
  @Output() public dateEvent: EventEmitter<void> = new EventEmitter();
  @Output() public formEvent: EventEmitter<FormGroup> = new EventEmitter();

  constructor(
    @Optional() private dashboardComponent: DashboardComponent,
    @Optional() private receitaListComponent: ReceitaListComponent,
    @Optional() private despesaListComponent: DespesaListComponent,
  ) {}

  ngOnInit(): void {
    this.configurarFormulario();
  }

  configurarFormulario() {

    try {

      let dtIni = moment().startOf('month').format('YYYY-MM-DD');
      let dtFim = moment().endOf('year').format('YYYY-MM-DD');

      let formulario = null;

      if(this.dashboardComponent && localStorage.getItem('formulario-data-dashboard')) {
        formulario = JSON.parse(localStorage.getItem('formulario-data-dashboard') ?? '');
      } else if (this.despesaListComponent && localStorage.getItem('formulario-data-despesa')) {
        formulario = JSON.parse(localStorage.getItem('formulario-data-despesa') ?? '');
      } else if (this.receitaListComponent && localStorage.getItem('formulario-data-receita')) {
        formulario = JSON.parse(localStorage.getItem('formulario-data-receita') ?? '');
      }

      if(formulario) {
        dtIni = formulario.dtIni;
        dtFim = formulario.dtFim;
      }

      this.formulario.controls['dtIni'].setValue(dtIni);
      this.formulario.controls['dtFim'].setValue(dtFim);

    } catch (error) {

      if(moment(this.formulario.value.dtIni).isValid() && moment(this.formulario.value.dtFim).isValid()) {
        this.formEvent.emit(this.formulario);
      }

    }
    
  }

  onChange() {
    if(moment(this.formulario.value.dtIni).isValid() && moment(this.formulario.value.dtFim).isValid()) {
      if(this.dashboardComponent) {
        localStorage.setItem('formulario-data-dashboard', JSON.stringify(this.formulario.value));
      } else if (this.despesaListComponent) {
        localStorage.setItem('formulario-data-despesa', JSON.stringify(this.formulario.value));
      } else if (this.receitaListComponent) {
        localStorage.setItem('formulario-data-receita', JSON.stringify(this.formulario.value));
      }
      this.dateEvent.emit();
    }
  }

} 
