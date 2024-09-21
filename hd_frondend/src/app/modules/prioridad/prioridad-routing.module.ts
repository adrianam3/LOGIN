import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrioridadListComponent } from './project/prioridad-list/prioridad-list.component';
import { AuthGuard } from 'src/app/demo/components/auth/guard.guard';

const routes: Routes = [
  {
    path: 'prioridad-list', component: PrioridadListComponent, canActivate: [AuthGuard],
    data: { expectedRole: ['administrador'] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrioridadRoutingModule { }
