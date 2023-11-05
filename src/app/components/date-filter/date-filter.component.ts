import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { DespesaListComponent } from 'src/app/modules/financeiro/despesa-list/despesa-list.component';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.css']
})
export class DateFilterComponent implements OnInit {

  @Input() public formulario!: FormGroup;
  @Output() public dateEvent: EventEmitter<void> = new EventEmitter();
  @Output() public formEvent: EventEmitter<FormGroup> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.configurarFormulario();
  }

  configurarFormulario() {

    try {

      let dtIni = moment().startOf('month').format('YYYY-MM-DD');
      let dtFim = moment().endOf('year').format('YYYY-MM-DD');

      if(localStorage.getItem('formulario-data')) {
        const formulario = JSON.parse(localStorage.getItem('formulario-data') ?? '');
        console.log('formulario: ', formulario);
        if(formulario) {
          dtIni = formulario.dtIni;
          dtFim = formulario.dtFim;
        }
      }

      const dtIniControl: FormControl = new FormControl(dtIni);
      const dtFimControl: FormControl = new FormControl(dtFim);
      
      this.formulario.addControl('dtIni', dtIniControl);
      this.formulario.addControl('dtFim', dtFimControl);

      if(moment(this.formulario.value.dtIni).isValid() && moment(this.formulario.value.dtFim).isValid()) {
        this.formEvent.emit(this.formulario);
      }

    } catch (error) {

      if(moment(this.formulario.value.dtIni).isValid() && moment(this.formulario.value.dtFim).isValid()) {
        this.formEvent.emit(this.formulario);
      }

    }
    
  }

  onChange() {
    if(moment(this.formulario.value.dtIni).isValid() && moment(this.formulario.value.dtFim).isValid()) {
      localStorage.setItem('formulario-data', JSON.stringify(this.formulario.value));
      this.dateEvent.emit();
    }
  }

} 
