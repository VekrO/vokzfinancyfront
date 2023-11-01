import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ModalComponent } from '../components/modal/modal.component';
import { ConfirmacaoComponent } from '../components/confirmacao/confirmacao.component';
import { DateFilterComponent } from '../components/date-filter/date-filter.component';

@NgModule({
  declarations: [
    ModalComponent,
    ConfirmacaoComponent,
    DateFilterComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    DateFilterComponent
  ]
})
export class SharedModule { }