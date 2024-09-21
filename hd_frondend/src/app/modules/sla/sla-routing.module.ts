import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SlaListComponent } from './project/sla-list/sla-list.component';
import { AuthGuard } from 'src/app/demo/components/auth/guard.guard';

const routes: Routes = [
  {
    path: 'sla-list', component: SlaListComponent, canActivate: [AuthGuard],
    data: { expectedRole: ['administrador'] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SlaRoutingModule { }
