 
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DespesaComponent } from './despesa/despesa.component';
import { ReceitaComponent } from './receita/receita.component';
import { AuthGuard } from 'src/app/guards/Auth.guard';
import { ReceitaListComponent } from './receita-list/receita-list.component';
import { DespesaListComponent } from './despesa-list/despesa-list.component';
import { ContaListComponent } from './conta-list/conta-list.component';
import { ContaComponent } from './conta/conta.component';

const routes: Routes = [
    {
        path: 'despesa', component: DespesaComponent, canActivate: [AuthGuard]
    },
    {
        path: 'receita', component: ReceitaComponent, canActivate: [AuthGuard]
    },
    {
        path: 'conta', component: ContaComponent, canActivate: [AuthGuard]
    },
    {
        path: 'despesas', component: DespesaListComponent, canActivate: [AuthGuard]
    },
    {
        path: 'receitas', component: ReceitaListComponent, canActivate: [AuthGuard]
    },
    {
        path: 'contas', component: ContaListComponent, canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FinanceiroRoutingModule {}