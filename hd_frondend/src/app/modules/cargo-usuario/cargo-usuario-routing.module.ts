import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CargoUsuarioListComponent } from './project/cargo-usuario-list/cargo-usuario-list.component';
import { AuthGuard } from 'src/app/demo/components/auth/guard.guard';

const routes: Routes = [
  {
    path: 'cargo-usuario-list', component: CargoUsuarioListComponent, canActivate: [AuthGuard],
    data: { expectedRole: ['administrador', 'coordinador', 'agente'] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargoUsuarioRoutingModule { }
