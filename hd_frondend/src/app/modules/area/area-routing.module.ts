import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaListComponent } from './project/area-list/area-list.component';
import { AuthGuard } from 'src/app/demo/components/auth/guard.guard';

const routes: Routes = [

    {
        path: 'area-list', component: AreaListComponent, canActivate: [AuthGuard],
        data: { expectedRole: ['administrador', 'coordinador', 'agente'] }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AreaRoutingModule { }
