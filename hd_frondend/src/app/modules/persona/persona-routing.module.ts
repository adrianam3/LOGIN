import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonaListComponent } from './project/persona-list/persona-list.component';
import { PersonaFormComponent } from './project/persona-form/persona-form.component';
import { AuthGuard } from 'src/app/demo/components/auth/guard.guard';

const routes: Routes = [
  {
    path: 'persona-list', component: PersonaListComponent, canActivate: [AuthGuard],
    data: { expectedRole: ['administrador'] }
  },
  {
    path: 'persona-form', component: PersonaFormComponent, canActivate: [AuthGuard],
    data: { expectedRole: ['administrador'] }
  },
  {
    path: 'persona-form/:codigo', component: PersonaFormComponent, canActivate: [AuthGuard],
    data: { expectedRole: ['administrador'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonaRoutingModule { }
