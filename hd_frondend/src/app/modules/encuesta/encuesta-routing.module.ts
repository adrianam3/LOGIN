import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EncuestaFormComponent } from './project/encuesta-form/encuesta-form.component';
import { EncuestaListComponent } from './project/encuesta-list/encuesta-list.component';
import { AuthGuard } from 'src/app/demo/components/auth/guard.guard';

const routes: Routes = [
    {
        path: 'encuesta-list',
        component: EncuestaListComponent,
        canActivate: [AuthGuard],
        data: { expectedRole: ['administrador'] },
    },
    {
        path: 'encuesta/:codigo',
        component: EncuestaFormComponent,
    },
    // {
    //     path: 'encuesta/:codigo', component: EncuestaFormComponent, canActivate: [AuthGuard],
    //     data: { expectedRole: ['usuario'] }
    // },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class EncuestaRoutingModule {}
