import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsuarioListComponent } from './project/usuario-list/usuario-list.component';
import { UsuarioFormComponent } from './project/usuario-form/usuario-form.component';
import { OlvidoContrasenaComponent } from './olvido-contrasena/olvido-contrasena.component';
import { AuthGuard } from 'src/app/demo/components/auth/guard.guard';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'olvido-contrasena', component: OlvidoContrasenaComponent },
    {
        path: 'usuario-list', component: UsuarioListComponent, canActivate: [AuthGuard],
        data: { expectedRole: ['administrador', 'coordinador', 'agente'] }
    },
    {
        path: 'usuario-form', component: UsuarioFormComponent, canActivate: [AuthGuard],
        data: { expectedRole: ['administrador', 'coordinador', 'agente'] }
    },
    {
        path: 'usuario-form/:codigo', component: UsuarioFormComponent, canActivate: [AuthGuard],
        data: { expectedRole: ['administrador', 'coordinador', 'agente'] }
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsuarioRoutingModule { }
