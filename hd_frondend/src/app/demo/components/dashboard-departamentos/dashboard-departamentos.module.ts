import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardDepartamentosRoutingModule } from './dashboard-departamentos-routing.module';
import { DepartamentosComponent } from './departamentos/departamentos.component';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';


@NgModule({
    declarations: [
        DepartamentosComponent
      ],
  imports: [
    CommonModule,
    DashboardDepartamentosRoutingModule,
    FormsModule,
    ChartModule,
    MenuModule,
    TableModule,
    StyleClassModule,
    PanelMenuModule,
    ButtonModule,
  ]
})
export class DashboardDepartamentosModule { }
