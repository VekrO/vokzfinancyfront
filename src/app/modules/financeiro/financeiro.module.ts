 
import { NgModule } from '@angular/core';
import { DespesaComponent } from './despesa/despesa.component';
import { SharedModule } from '../shared.module';
import { FinanceiroRoutingModule } from './financeiro-routing.module';
import { DespesaListComponent } from './despesa-list/despesa-list.component';
import { ReceitaListComponent } from './receita-list/receita-list.component';
import { ReceitaComponent } from './receita/receita.component';

@NgModule({
    declarations: [
        ReceitaComponent,
        DespesaComponent,
        DespesaListComponent,
        ReceitaListComponent
    ],
    imports: [
        SharedModule,
        FinanceiroRoutingModule,
    ],
    exports: [
        ReceitaComponent,
        DespesaComponent,
        DespesaListComponent,
        ReceitaListComponent
    ]
})
export class FinanceiroModule {}