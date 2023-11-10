import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ModalComponent } from '../components/modal/modal.component';
import { ConfirmacaoComponent } from '../components/confirmacao/confirmacao.component';
import { DateFilterComponent } from '../components/date-filter/date-filter.component';
import { LoadingComponent } from '../components/loading/loading.component';
import { TooltipDirective } from '../directives/tooltip.directive';

@NgModule({
  declarations: [
    ModalComponent,
    ConfirmacaoComponent,
    DateFilterComponent,
    LoadingComponent,
    TooltipDirective
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
    DateFilterComponent,
    LoadingComponent,
    TooltipDirective
  ]
})
export class SharedModule { }