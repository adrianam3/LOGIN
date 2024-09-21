import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseConocimientoListComponent } from './proyect/base-conocimiento-list/base-conocimiento-list.component';

const routes: Routes = [
  { path: 'base-conocimiento-list', component: BaseConocimientoListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseConocimientoRoutingModule { }
