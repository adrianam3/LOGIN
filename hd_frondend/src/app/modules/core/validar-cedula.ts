// src/app/validators.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cedulaEcuatorianaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const cedula = control.value;

        if (!cedula || cedula.length !== 10 || !/^\d+$/.test(cedula)) {
            return { cedulaInvalida: true };
        }

        const digitoRegion = parseInt(cedula.substring(0, 2), 10);
        if (digitoRegion < 1 || digitoRegion > 24) {
            return { cedulaInvalida: true };
        }

        const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        let total = 0;

        for (let i = 0; i < 9; i++) {
            let valor = parseInt(cedula[i], 10) * coeficientes[i];
            if (valor >= 10) {
                valor -= 9;
            }
            total += valor;
        }

        const ultimoDigito = parseInt(cedula[9], 10);
        const digitoVerificador = total % 10 === 0 ? 0 : 10 - (total % 10);

        return digitoVerificador === ultimoDigito ? null : { cedulaInvalida: true };
    };
}
