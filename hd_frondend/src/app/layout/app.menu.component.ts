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
            ...(this.validarRol.administrador() ? [
                {
                    label: 'DASHBOARD',
                    items: [
                        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
                        { label: 'Departamentos', icon: 'pi pi-user', routerLink: ['/dashboard-departamentos/departamentos'] },
                    ]
                },
            ] : []),
            ...(this.validarRol.administrador() ? [
                {
                    label: 'GESTIÓN',
                    items: [
                        { label: 'Persona', icon: 'pi pi-briefcase', routerLink: ['/persona/persona-list'] },
                        { label: 'Roles', icon: 'pi pi-fw pi-id-card', routerLink: ['/rol/rol-list'] },
                    ]
                },
            ] : []),
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
            ...(this.validarRol.administrador() || this.validarRol.coordinador() ? [
                {
                    label: 'GESTIÒN DE AGENTES',
                    items: [
                        { label: 'Agente', icon: 'pi pi-fw pi-star', routerLink: ['/agente/agente-list'] },
                        { label: 'Departamentos de soporte', icon: 'pi pi-fw pi-list', routerLink: ['/departamento/departamento-list'] },
                    ]
                },
            ] : []),
            {
                label: this.validarRol.usuario() ? 'TICKETS' : 'GESTIÓN DE TICKETS',
                items: [
                    { label: 'Ticket', icon: 'pi pi-fw pi-calendar-times', routerLink: ['/ticket/ticket-list'] },
                    ...(this.validarRol.administrador() ? [{ label: 'Estados del Ticket', icon: 'pi pi-fw pi-calendar-times', routerLink: ['/estado-ticket/estado-ticket-list'] }] : []),
                    ...(this.validarRol.administrador() ? [{ label: 'Prioridad', icon: 'pi pi-fw pi-calendar-times', routerLink: ['/prioridad/prioridad-list'] }] : []),
                    ...(this.validarRol.administrador() ? [{ label: 'SLA', icon: 'pi pi-fw pi-calendar-times', routerLink: ['/sla/sla-list'] }] : [])
                ]
            },
            {
                ...(this.validarRol.administrador() ? [{ label: 'ENCUESTA', icon: 'pi pi-fw pi-star-fill', routerLink: ['/encuesta/encuesta-list'] }] : []),
            },
            {
                label: this.validarRol.usuario() ? 'FAQs' : 'FAQs',
                items: [
                    { label: 'Base de conocimiento', icon: 'pi pi-fw pi-home', routerLink: ['/base-conocimiento/base-conocimiento-list'] },
                ]
            },
            {
                label: this.validarRol.administrador() ? 'Encuesta' : '',
                items: [
                    ... (this.validarRol.administrador() ? [{ label: 'Lista de Encuestas', icon: 'pi pi-fw pi-star-fill', routerLink: ['/encuesta/encuesta-list'] }] : []),
                ]
            }
        ];
    }
}
