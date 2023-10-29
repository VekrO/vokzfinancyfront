import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ModalComponent } from '../components/modal/modal.component';
import { ConfirmacaoComponent } from '../components/confirmacao/confirmacao.component';

@NgModule({
  declarations: [
    ModalComponent,
    ConfirmacaoComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyMaskModule
  ]
})
export class SharedModule { }