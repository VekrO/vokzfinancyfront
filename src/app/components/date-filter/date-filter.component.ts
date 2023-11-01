import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.css']
})
export class DateFilterComponent implements OnInit {

  @Input() public formulario!: FormGroup;
  @Output() public dateEvent: EventEmitter<void> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.configurarFormulario();
  }

  configurarFormulario() {

    const dtIniControl: FormControl = new FormControl(moment().startOf('month').format('YYYY-MM-DD'));
    const dtFimControl: FormControl = new FormControl(moment().endOf('year').format('YYYY-MM-DD'));
    
    this.formulario.addControl('dtIni', dtIniControl);
    this.formulario.addControl('dtFim', dtFimControl);
    
  }

  onChange() {
    if(moment(this.formulario.value.dtIni).isValid() && moment(this.formulario.value.dtFim).isValid()) {
      this.dateEvent.emit();
    }
  }

} 
