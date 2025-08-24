import { DepartamentosComponent } from './departamentos/departamentos.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guard.guard';

const routes: Routes = [
    {
      path: 'departamentos', component: DepartamentosComponent, canActivate: [AuthGuard],
      data: { expectedRole: ['administrador'] }
    },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardDepartamentosRoutingModule { }
