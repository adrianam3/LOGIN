import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {
    rol = localStorage.getItem('idRol');
    descRol = this.getDatos();
    usuario = localStorage.getItem('nombres') + ' ' + localStorage.getItem('apellidos') + ' - ' + this.descRol;

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService) { }

    getDatos() {
        let descripcion = '';
        if (this.rol == '1') {
            descripcion = 'Administrador';
        } else if (this.rol == '2') {
            descripcion = 'Usuario';
        } else if (this.rol == '3') {
            descripcion = 'Agente';
        } else if (this.rol == '4') {
            descripcion = 'Coordinador';
        }
        return descripcion;
    }
}
