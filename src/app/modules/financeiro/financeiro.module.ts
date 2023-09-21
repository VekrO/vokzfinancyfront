 
import { NgModule } from '@angular/core';
import { DespesaComponent } from './despesa/despesa.component';
import { ReceitaComponent } from './receita/receita.component';
import { SharedModule } from '../shared.module';
import { FinanceiroRoutingModule } from './financeiro-routing.module';
import { DespesaListComponent } from './despesa-list/despesa-list.component';

@NgModule({
    declarations: [
        ReceitaComponent,
        DespesaComponent,
        DespesaListComponent,
    ],
    imports: [
        SharedModule,
        FinanceiroRoutingModule,
    ],
    exports: [
        ReceitaComponent,
        DespesaComponent,
        DespesaListComponent,
    ]
})
export class FinanceiroModule {}