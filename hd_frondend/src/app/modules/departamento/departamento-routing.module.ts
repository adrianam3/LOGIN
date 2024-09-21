import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartamentoListComponent } from './project/departamento-list/departamento-list.component';
import { AuthGuard } from 'src/app/demo/components/auth/guard.guard';

const routes: Routes = [
    {
        path: 'departamento-list', component: DepartamentoListComponent, canActivate: [AuthGuard],
        data: { expectedRole: ['administrador', 'coordinador'] }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DepartamentoRoutingModule { }
