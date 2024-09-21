import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../auth/guard.guard';

const routes: Routes = [
    {
      path: '', component: DashboardComponent, canActivate: [AuthGuard],
      data: { expectedRole: ['administrador'] }
    },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardsRoutingModule { }
