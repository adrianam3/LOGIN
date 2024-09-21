import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstadoTicketListComponent } from './project/estado-ticket-list/estado-ticket-list.component';
import { AuthGuard } from 'src/app/demo/components/auth/guard.guard';

const routes: Routes = [
  {
    path: 'estado-ticket-list', component: EstadoTicketListComponent, canActivate: [AuthGuard],
    data: { expectedRole: ['administrador'] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadoTicketRoutingModule { }
