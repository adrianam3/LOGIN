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
                        path: 'rol', loadChildren: () => import('./modules/rol/rol.module').then(m => m.RolModule)
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
