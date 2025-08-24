import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { ValidarRolesService } from '../modules/core/validar-roles.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService, public validarRol: ValidarRolesService) { }

    ngOnInit() {
        this.validarRol.coordinador()
        this.model = [
       
            ...(this.validarRol.administrador() || this.validarRol.coordinador() || this.validarRol.agente() ? [
                {
                    label: 'GESTIÓN DE USUARIOS',
                    items: [

                        { label: 'Usuario', icon: 'pi pi-user', routerLink: ['/usuario/usuario-list'] },
                        { label: 'Área del usuario', icon: 'pi pi-fw pi-table', routerLink: ['/area/area-list'] },
                        { label: 'Cargos del usuario', icon: 'pi pi-user', routerLink: ['/cargo-usuario/cargo-usuario-list'] },
                    ]
                },
            ] : []),
          
        ];
    }
}
