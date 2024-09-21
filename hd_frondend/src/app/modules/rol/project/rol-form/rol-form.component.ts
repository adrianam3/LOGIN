import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Rol } from '../model/rol';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-rol-form',
    templateUrl: './rol-form.component.html',
    styleUrl: './rol-form.component.scss'
})
export class RolFormComponent implements OnInit {
    public rolForm: FormGroup;
    public rol: Rol;
    public isEdicion: boolean;
    public bloquearEdicion: boolean;
    public estados: any;
    private idRol: number;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        this.getRol(); // Llamar al método de inicialización del rol
    }

    postData(data: any, operation: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/controllers/rol.controller.php?${operation}`, data);
    }

    public confirmVolver() {
        this.confirmationService.confirm({
            key: 'rol',
            header: 'Cancelar',
            message: '¿Está seguro de cancelar la edición del Rol?',
            accept: () => {
                this.router.navigate(['/rol/rol-list']);
            },
            reject: () => {
            }
        });
    }

    public confirmActivarDesactivar(rol: any) {
        this.confirmationService.confirm({
            key: 'rol',
            header: rol.estado === '0' ? 'Activar' : 'Desactivar',
            message: rol.estado === '0' ? '¿Está seguro de activar el rol?' : '¿Está seguro de desactivar al rol?',
            accept: () => {
                const nuevoEstado = rol.estado === '0' ? '1' : '0';
                this.rolForm.get('estado').enable();
                this.rolForm.patchValue({ estado: nuevoEstado });
                this.confirmCreateOrUpdateRol('op=actualizar');
            }
        });
    }

    public confirmCrearActualizar(operation: string) {
        this.confirmationService.confirm({
            key: 'rol',
            header: operation === 'op=insertar' ? 'Crear' : 'Actualizar',
            message: operation === 'op=insertar' ? '¿Está seguro de crear el rol?' : '¿Está seguro de actualizar el rol?',
            accept: () => {
                this.confirmCreateOrUpdateRol(operation);
            }
        });
    }

    private async getRol() {
        this.activatedRoute.params.subscribe(async params => {
            this.idRol = params['codigo'];
            if (this.idRol) {
                await this.getRolByCodigo(this.idRol);
            } else {
                this.formRol({
                    idRol: '',
                    nombreRol: '',
                    descripcion: '',
                    estado: '1', // Valor predeterminado de estado

                });
            }
        });
    }

    private formRol(data: any): FormGroup {
        const { idRol, nombreRol, descripcion, estado } = data;
        this.rol = new Rol();
        this.isEdicion = !!idRol;
        this.bloquearEdicion = this.isEdicion; // Bloquear edición si es un modo de edición

        this.rolForm = this.fb.group({
            idRol: [idRol],
            nombreRol: [nombreRol, Validators.required],
            descripcion: [descripcion, Validators.required],
            estado: [estado],

        });

        this.rol = this.rolForm.value as Rol;
        return this.rolForm;
    }

    private async getRolByCodigo(idRol: number) {
        const formData = new FormData();
        formData.append("idRol", idRol.toString());

        try {
            const response = await lastValueFrom(this.postData(formData, 'op=uno'));
            this.formRol(response);
        } catch (error) {
            console.error('Error al obtener datos del rol', error);
        }
    }

    public async confirmCreateOrUpdateRol(operation: string) {
        if (this.rolForm.valid) {
            const formData = this.createFormData(this.rolForm.value);
            try {
                const response = await lastValueFrom(this.postData(formData, operation));
                this.formRol(response);
                await this.getRol();
                this.router.navigate(['/rol/rol-list']);
                setTimeout(() => {
                    this.showToast('success', 'Éxito', 'La operación se realizó correctamente.');
                }, 200);
            } catch (error) {
                this.showToast('error', 'Error', 'Ocurrió un error al realizar la operación.');
            }
        } else {
            this.showToast('error', 'Error', 'Formulario inválido.');
        }
    }

    private createFormData(data: any): FormData {
        const formData = new FormData();
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                formData.append(key, data[key]);
            }
        }
        return formData;
    }

    public showToast(severity: 'success' | 'error', summary: string, detail: string) {
        this.messageService.add({ severity, summary, detail });
    }
}

