import { Component, OnInit } from '@angular/core'; // Agregar OnInit
import { Persona } from '../model/persona';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, lastValueFrom } from 'rxjs'; // Importar lastValueFrom
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { cedulaEcuatorianaValidator } from 'src/app/modules/core/validar-cedula';
@Component({
    selector: 'app-persona-form',
    templateUrl: './persona-form.component.html',
    styleUrl: './persona-form.component.scss'
})
export class PersonaFormComponent implements OnInit { // Implementar OnInit
    public personaForm: FormGroup;
    public persona: Persona;
    public isEdicion: boolean;
    public bloquearEdicion: boolean;
    public estados: any;
    private idPersona: number;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        this.getPersona(); // Llamar al método de inicialización de la persona
    }

    postData(data: any, operation: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/controllers/persona.controller.php?${operation}`, data);
    }

    public confirmVolver() {
        this.confirmationService.confirm({
            key: 'persona',
            header: 'Cancelar',
            message: '¿Está seguro de cancelar la edición de la persona?',
            accept: () => {
                this.router.navigate(['/persona/persona-list']);
            }
        });
    }

    public confirmActivarDesactivar(persona: any) {
        this.confirmationService.confirm({
            key: 'persona',
            header: persona.estado === '0' ? 'Activar' : 'Desactivar',
            message: persona.estado === '0' ? '¿Está seguro de activar a la persona?' : '¿Está seguro de desactivar a la persona?',
            accept: () => {
                const nuevoEstado = persona.estado === '0' ? '1' : '0';
                this.personaForm.get('estado').enable();
                this.personaForm.patchValue({ estado: nuevoEstado });
                this.confirmCreateOrUpdatePersona('op=actualizar');
            }
        });
    }

    public confirmCrearActualizar(operation: string) {
        this.confirmationService.confirm({
            key: 'persona',
            header: operation === 'op=insertar' ? 'Crear' : 'Actualizar',
            message: operation === 'op=insertar' ? '¿Está seguro de crear la persona?' : '¿Está seguro de actualizar la persona?',
            accept: () => {
                this.confirmCreateOrUpdatePersona(operation);
            }
        });
    }

    private async getPersona() {
        this.activatedRoute.params.subscribe(async params => {
            this.idPersona = params['codigo'];
            if (this.idPersona) {
                await this.getPersonaByCodigo(this.idPersona);
            } else {
                this.formPersona({
                    cedula: '',
                    nombres: '',
                    apellidos: '',
                    direccion: '',
                    email: '',
                    telefono: '',
                    celular: '',
                    estado: '1', // Valor predeterminado de estado
                    idPersona: ''
                });
            }
        });
    }

    private formPersona(data: any): FormGroup {
        const { cedula, nombres, apellidos, direccion, email, telefono, celular, estado, idPersona } = data;
        this.persona = new Persona();
        this.isEdicion = !!idPersona;
        this.bloquearEdicion = this.isEdicion;

        this.personaForm = this.fb.group({
            cedula: [cedula, [Validators.required, cedulaEcuatorianaValidator()]],
            nombres: [nombres, Validators.required],
            apellidos: [apellidos, Validators.required],
            direccion: [direccion, Validators.required],
            email: [email, [Validators.required, Validators.email]],
            telefono: [telefono, [Validators.required, Validators.pattern(/^\d+$/)]],
            celular: [celular, [Validators.required, Validators.pattern(/^\d+$/)]],
            estado: [estado],
            idPersona: [idPersona]
        });

        this.persona = this.personaForm.value as Persona;
        return this.personaForm;
    }

    private async getPersonaByCodigo(idPersona: number) {
        const formData = new FormData();
        formData.append("idPersona", idPersona.toString());

        try {
            const response = await lastValueFrom(this.postData(formData, 'op=uno'));
            this.formPersona(response);
        } catch (error) {
            console.error('Error al obtener datos de la persona', error);
        }
    }

    public async confirmCreateOrUpdatePersona(operation: string) {
        if (this.personaForm.valid) {
            const formData = this.createFormData(this.personaForm.value);
            try {
                const response = await lastValueFrom(this.postData(formData, operation));
                this.formPersona(response);
                await this.getPersona();
                this.router.navigate(['/persona/persona-list']);
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
