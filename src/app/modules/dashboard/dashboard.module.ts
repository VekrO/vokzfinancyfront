import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FinanceiroModule } from '../financeiro/financeiro.module';
import { SharedModule } from '../shared.module';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';

@NgModule({
  declarations: [  
    DashboardComponent, 
    NavbarComponent,
    SidebarComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FinanceiroModule,
    DashboardRoutingModule,
  ],
  exports: [
    NavbarComponent
  ],
})
export class DashboardModule { }
