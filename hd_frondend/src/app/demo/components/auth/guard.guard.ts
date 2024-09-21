import { CanActivateFn } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ValidarRolesService } from '../../../modules/core/validar-roles.service';

export const guardGuard: CanActivateFn = (route, state) => {
  return true;
};



@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public validarRol: ValidarRolesService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const expectedRole: any = route.data['expectedRole'];  // El rol que esperas de la ruta


    for (let index = 0; index < expectedRole.length; index++) {
      const element = expectedRole && this.validarRol[expectedRole[index]]();
      if (element) {
        return true;
      }

    }

    this.router.navigate(['/']);
    return false;
  }
}
