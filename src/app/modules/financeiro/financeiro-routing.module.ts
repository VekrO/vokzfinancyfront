 
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DespesaComponent } from './despesa/despesa.component';
import { ReceitaComponent } from './receita/receita.component';
import { AuthGuard } from 'src/app/guards/Auth.guard';

const routes: Routes = [
    {
        path: 'despesa', component: DespesaComponent, canActivate: [AuthGuard]
    },
    {
        path: 'receita', component: ReceitaComponent, canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FinanceiroRoutingModule {}