import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../model/Usuario';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-usuario-form',
    templateUrl: './usuario-form.component.html',
    styleUrl: './usuario-form.component.scss'
})
export class UsuarioFormComponent implements OnInit {
    public usuarioForm: FormGroup;
    public usuario: Usuario;
    public isEdicion: boolean;
    public bloquearEdicion: boolean;
    public estados: any;
    public personas: any = [];
    public roles: any = [];
    public areas: any = [];
    private idUsuario: number;
    public loading: boolean = false;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        this.loadData();
    }

    postData(data: any, operation: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/controllers/usuario.controller.php?${operation}`, data);
    }

    postDataPersonas(data: any, operation: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/controllers/persona.controller.php?${operation}`, data);
    }


    private personaApi = `${environment.apiUrl}/controllers/persona.controller.php?op=`;
    getPersonas(operation: string): Observable<any[]> {
        this.activatedRoute.params.subscribe(async params => {
            this.idUsuario = params['codigo'];
        })
        if (this.idUsuario) {
            operation = 'todos';
        } else {
            operation = 'todossinusuario';
        }
        return this.http.get<any[]>(`${this.personaApi}${operation}`);
    }

    postDataRoles(data: any, operation: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/controllers/rol.controller.php?${operation}`, data);
    }

    private rolApi = `${environment.apiUrl}/controllers/rol.controller.php?op=todos`;
    getRoles(): Observable<any[]> {
        return this.http.get<any[]>(this.rolApi);
    }

    postDataAreasU(data: any, operation: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/controllers/areausuario.controller.php?${operation}`, data);
    }

    private areaUsuarioApi = `${environment.apiUrl}/controllers/areausuario.controller.php?op=todos`;
    getAreasU(): Observable<any[]> {
        return this.http.get<any[]>(this.areaUsuarioApi);
    }

    public async loadData() {
        await this.loadEntities([
            { apiCall: this.getPersonas(''), property: 'personas', mapFunction: (persona: any) => `${persona.nombres} ${persona.apellidos}` },
            { apiCall: this.getRoles(), property: 'roles', mapFunction: (rol: any) => rol.nombreRol },
            { apiCall: this.getAreasU(), property: 'areas', mapFunction: (area: any) => area.nombre }
        ]);
        this.getUsuario();
    }

    private async loadEntities(entities: Array<{ apiCall: Observable<any[]>, property: string, mapFunction: (item: any) => string }>) {
        for (const entity of entities) {
            const params = await lastValueFrom(entity.apiCall);
            if (params && Array.isArray(params)) {
                this[entity.property] = params.map((item) => {
                    item.nombreCompleto = entity.mapFunction(item);
                    return item;
                });
            } else {
                this[entity.property] = [];
            }
        }
    }

    public confirmVolver() {
        this.confirmationService.confirm({
            key: 'usuario',
            header: 'Cancelar',
            message: '¿Está seguro de cancelar la edición del usuario?',
            accept: () => {
                this.router.navigate(['/usuario/usuario-list']);
            },
            reject: () => {
            }
        });
    }

    public confirmActivarDesactivar(usuario: any) {
        this.confirmationService.confirm({
            key: 'usuario',
            header: usuario.estado === '0' ? 'Activar' : 'Desactivar',
            message: usuario.estado === '0' ? '¿Está seguro de activar al usuario?' : '¿Está seguro de desactivar al usuario?',
            accept: () => {
                const nuevoEstado = usuario.estado === '0' ? '1' : '0';
                this.usuarioForm.get('estado').enable();
                this.usuarioForm.patchValue({ estado: nuevoEstado });
                this.confirmCreateOrUpdateUsuario('op=actualizar');
            }
        });
    }

    public confirmCrearActualizar(operation: string) {
        this.confirmationService.confirm({
            key: 'usuario',
            header: operation === 'op=insertar' ? 'Crear' : 'Actualizar',
            message: operation === 'op=insertar' ? '¿Está seguro de crear el usuario?' : '¿Está seguro de actualizar el usuario?',
            accept: () => {
                this.confirmCreateOrUpdateUsuario(operation);
            }
        });
    }

    private async getUsuario() {
        this.activatedRoute.params.subscribe(async params => {
            this.idUsuario = params['codigo'];
            if (this.idUsuario) {
                await this.getUsuarioByCodigo(this.idUsuario);
            } else {
                this.formUsuario({
                    idUsuario: '',
                    usuario: '',
                    password: '',
                    descripcion: '',
                    idPersona: '',
                    idAreaU: '',
                    idRol: '',
                    idCargoU: '1',
                    estado: '1', // Valor predeterminado de estado
                });
            }
        });
    }

    private formUsuario(data: any): FormGroup {
        const { idUsuario, usuario, password, descripcion, idPersona, idAreaU, idRol, idCargoU, estado } = data;
        this.usuario = new Usuario();
        this.isEdicion = !!idUsuario;
        this.bloquearEdicion = this.isEdicion;

        this.usuarioForm = this.fb.group({
            idUsuario: [idUsuario],
            usuario: [usuario, [Validators.required]],
            password: [{ value: password, disabled: this.isEdicion },
            [
                Validators.required,           // Campo requerido
                Validators.minLength(8),       // Mínimo de 8 caracteres
                this.passwordStrengthValidator // Validación personalizada para seguridad
            ]],
            descripcion: [descripcion],
            idPersona: [idPersona],
            idAreaU: [idAreaU],
            idRol: [idRol],
            idCargoU: [idCargoU],
            estado: [estado],
            persona: [{ value: idPersona, disabled: this.bloquearEdicion }, Validators.required],
            rol: [idRol, Validators.required],
            area: [idAreaU, Validators.required],
        });

        // Escuchar cambios en el selector de persona y actualizar idPersona
        this.usuarioForm.get('persona').valueChanges.subscribe((persona) => {
            const personaId = persona?.idPersona || persona;
            this.usuarioForm.get('idPersona').setValue(personaId);
        });

        // Escuchar cambios en el selector de rol y actualizar idRol
        this.usuarioForm.get('rol').valueChanges.subscribe((rol) => {
            const rolId = rol?.idRol || rol;
            this.usuarioForm.get('idRol').setValue(rolId);
        });

        // Escuchar cambios en el selector de área y actualizar idAreaU
        this.usuarioForm.get('area').valueChanges.subscribe((area) => {
            const areaId = area?.idAreaU || area;
            this.usuarioForm.get('idAreaU').setValue(areaId);
        });

        const personaSeleccionada = this.personas.find((persona) => persona.idPersona == idPersona)
        this.usuarioForm.get('persona').setValue(personaSeleccionada);
        const rolSeleccionado = this.roles.find((rol) => rol.idRol == idRol)
        this.usuarioForm.get('rol').setValue(rolSeleccionado);
        const areaSeleccionada = this.areas.find((area) => area.idAreaU == idAreaU)
        this.usuarioForm.get('area').setValue(areaSeleccionada);

        this.usuario = this.usuarioForm.value as Usuario;
        return this.usuarioForm;
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

    private async getUsuarioByCodigo(idUsuario: number) {
        const formData = new FormData();
        formData.append("idUsuario", idUsuario.toString());
        try {
            const response = await lastValueFrom(this.postData(formData, 'op=uno'));
            this.formUsuario(response);
        } catch (error) {
            console.error('Error al obtener datos del Usuario', error);
        }
    }

    public async confirmCreateOrUpdateUsuario(operation: string) {
        this.loading = true;
        if (this.usuarioForm.valid) {
            const formData = this.createFormData(this.usuarioForm.value);
            try {
                const response = await lastValueFrom(this.postData(formData, operation));
                this.formUsuario(response);
                await this.getUsuario();
                this.router.navigate(['/usuario/usuario-list']);
                setTimeout(() => {
                    this.showToast('success', 'Éxito', 'La operación se realizó correctamente.');
                }, 200);
            } catch (error) {
                this.showToast('error', 'Error', 'Ocurrió un error al realizar la operación.');
            } finally {
                this.loading = false;
            }
        } else {
            this.showToast('error', 'Error', 'Formulario inválido.');
            this.loading = false;
        }
    }

    public showToast(severity: 'success' | 'error', summary: string, detail: string) {
        this.messageService.add({ severity, summary, detail });
    }

    // Validador personalizado
    private passwordStrengthValidator(control: any) {
        const value = control.value;
        const hasUpperCase = /[A-Z]/.test(value);  // Tiene mayúsculas
        const hasLowerCase = /[a-z]/.test(value);  // Tiene minúsculas
        const hasNumeric = /\d/.test(value);       // Tiene números
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value); // Tiene caracteres especiales
        const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;

        if (!valid) {
            return { weakPassword: true };
        }
        return null;
    }
}
