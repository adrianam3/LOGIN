import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { LoginComponent } from './modules/usuario/login/login.component';
import { OlvidoContrasenaComponent } from './modules/usuario/olvido-contrasena/olvido-contrasena.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', redirectTo: '/login', pathMatch: 'full' },
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
                    { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) },
                    {
                        path: 'usuario', loadChildren: () => import('./modules/usuario/usuario.module').then(m => m.UsuarioModule)
                    },
                    {
                        path: 'persona', loadChildren: () => import('./modules/persona/persona.module').then(m => m.PersonaModule)
                    },
                    {
                        path: 'cargo-usuario', loadChildren: () => import('./modules/cargo-usuario/cargo-usuario.module').then(m => m.CargoUsuarioModule)
                    },
                    {
                        path: 'rol', loadChildren: () => import('./modules/rol/rol.module').then(m => m.RolModule)
                    },
                    {
                        path: 'departamento', loadChildren: () => import('./modules/departamento/departamento.module').then(m => m.DepartamentoModule)
                    },
                    {
                        path: 'area', loadChildren: () => import('./modules/area/area.module').then(m => m.AreaModule)
                    },
                    {
                        path: 'agente', loadChildren: () => import('./modules/agente/agente.module').then(m => m.AgenteModule)
                    },
                    {
                        path: 'ticket', loadChildren: () => import('./modules/ticket/ticket.module').then(m => m.TicketModule)
                    },
                    {
                        path: 'estado-ticket', loadChildren: () => import('./modules/estado-ticket/estado-ticket.module').then(m => m.EstadoTicketModule)
                    },
                    {
                        path: 'prioridad', loadChildren: () => import('./modules/prioridad/prioridad.module').then(m => m.PrioridadModule)
                    },
                    {
                        path: 'sla', loadChildren: () => import('./modules/sla/sla.module').then(m => m.SlaModule)
                    },
                    {
                        path: 'encuesta', loadChildren: () => import('./modules/encuesta/encuesta.module').then(m => m.EncuestaModule)
                    },
                    {
                        path: 'base-conocimiento', loadChildren: () => import('./modules/base-conocimiento/base-conocimiento.module').then(m => m.BaseConocimientoModule)
                    },
                    {
                        path: 'dashboard-departamentos', loadChildren: () => import('./demo/components/dashboard-departamentos/dashboard-departamentos.module').then(m => m.DashboardDepartamentosModule)
                    },
                    {
                        path: 'dashboard', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule)
                    },
                ]
            },
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: 'login', component: LoginComponent },
            { path: 'olvido-contrasena', component: OlvidoContrasenaComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
