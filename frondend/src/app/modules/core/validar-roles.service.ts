import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidarRolesService {

  public idUsuario: string;
  public idRol: string;
  public email: string;
  public nombreCompleto: string;
  constructor() { }

  // validarRol(idRol) {
  //   this.idRol = localStorage.getItem('idRol');
  //   // 1 Administrador, 2 Usuario, 3 Agente, 4 Coordinador

  //   return this.idRol === idRol;
  // }
  administrador() {
    return localStorage.getItem('idRol') === '1';
  }
  usuario() {
    return localStorage.getItem('idRol') === '2';
  }
  agente() {
    return localStorage.getItem('idRol') === '3';
  }
  coordinador() {
    return localStorage.getItem('idRol') === '4';
  }
}
