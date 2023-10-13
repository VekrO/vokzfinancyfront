import { ContaComponent } from './conta/conta.component';
 
import { NgModule } from '@angular/core';
import { DespesaComponent } from './despesa/despesa.component';
import { SharedModule } from '../shared.module';
import { FinanceiroRoutingModule } from './financeiro-routing.module';
import { DespesaListComponent } from './despesa-list/despesa-list.component';
import { ReceitaListComponent } from './receita-list/receita-list.component';
import { ReceitaComponent } from './receita/receita.component';
import { ContaListComponent } from './conta-list/conta-list.component';

@NgModule({
    declarations: [
        ReceitaComponent,
        DespesaComponent,
        DespesaListComponent,
        ReceitaListComponent,
        ContaComponent,
        ContaListComponent
    ],
    imports: [
        SharedModule,
        FinanceiroRoutingModule,
    ],
    exports: [
        ReceitaComponent,
        DespesaComponent,
        DespesaListComponent,
        ReceitaListComponent,
        ContaComponent,
        ContaListComponent
    ]
})
export class FinanceiroModule {}