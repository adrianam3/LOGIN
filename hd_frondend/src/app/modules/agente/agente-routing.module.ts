import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgenteListComponent } from './project/agente-list/agente-list.component';
import { AgenteFormComponent } from './project/agente-form/agente-form.component';
import { AuthGuard } from 'src/app/demo/components/auth/guard.guard';

const routes: Routes = [
    {
        path: 'agente-list', component: AgenteListComponent, canActivate: [AuthGuard],
        data: { expectedRole: ['administrador', 'coordinador'] }
    },
    {
        path: 'agente-form', component: AgenteFormComponent, canActivate: [AuthGuard],
        data: { expectedRole: ['administrador', 'coordinador'] }
    },
    {
        path: 'agente-form/:codigo', component: AgenteFormComponent, canActivate: [AuthGuard],
        data: { expectedRole: ['administrador', 'coordinador'] }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AgenteRoutingModule { }
