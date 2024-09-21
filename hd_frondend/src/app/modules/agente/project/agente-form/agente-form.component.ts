import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Agente } from '../model/Agente';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-agente-form',
  templateUrl: './agente-form.component.html',
  styleUrl: './agente-form.component.scss'
})
export class AgenteFormComponent implements OnInit {
  public agenteForm: FormGroup;
  public agente: Agente;
  public isEdicion: boolean;
  public bloquearEdicion: boolean;
  public estados: any;
  public usuarios: any = [];
  private idAgente: number;

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
    return this.http.post<any>(`${environment.apiUrl}/controllers/agente.controller.php?${operation}`, data);
  }

  postDataUsuarios(data: any, operation: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/controllers/usuario.controller.php?${operation}`, data);
  }

  private usuarioApi = `${environment.apiUrl}/controllers/usuario.controller.php?op=todos`;
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.usuarioApi);
  }

  // postDataRoles(data: any, operation: string): Observable<any> {
  //   return this.http.post<any>(`${environment.apiUrl}/controllers/rol.controller.php?${operation}`, data);
  // }

  // private rolApi = `${environment.apiUrl}/controllers/rol.controller.php?op=todos`;
  // getRoles(): Observable<any[]> {
  //   return this.http.get<any[]>(this.rolApi);
  // }

  // postDataAreasU(data: any, operation: string): Observable<any> {
  //   return this.http.post<any>(`${environment.apiUrl}/controllers/areausuario.controller.php?${operation}`, data);
  // }

  // private areaUsuarioApi = `${environment.apiUrl}/controllers/areausuario.controller.php?op=todos`;
  // getAreasU(): Observable<any[]> {
  //   return this.http.get<any[]>(this.areaUsuarioApi);
  // }

  public async loadData() {
    await this.loadEntities([
      { apiCall: this.getUsuarios(), property: 'usuarios', mapFunction: (usuario: any) => usuario.agenteNombreCompleto }
    ]);
    this.getAgente();
  }

  private async loadEntities(entities: Array<{ apiCall: Observable<any[]>, property: string, mapFunction: (item: any) => string }>) {
    for (const entity of entities) {
      const params = await lastValueFrom(entity.apiCall);
      this[entity.property] = params.map((item) => {
        item.nombreCompleto = entity.mapFunction(item);
        return item;
      });
    }
  }

  public confirmVolver() {
    this.confirmationService.confirm({
      key: 'agente',
      header: 'Cancelar',
      message: '¿Está seguro de cancelar la edición del agente?',
      accept: () => {
        this.router.navigate(['/agente/agente-list']);
      },
      reject: () => {
      }
    });
  }

  public confirmActivarDesactivar(agente: any) {
    this.confirmationService.confirm({
      key: 'agente',
      header: agente.estado === '0' ? 'Activar' : 'Desactivar',
      message: agente.estado === '0' ? '¿Está seguro de activar al agente?' : '¿Está seguro de desactivar al agente?',
      accept: () => {
        const nuevoEstado = agente.estado === '0' ? '1' : '0';
        this.agenteForm.get('estado').enable();
        this.agenteForm.patchValue({ estado: nuevoEstado });
        this.confirmCreateOrUpdateAgente('op=actualizar');
      }
    });
  }

  public confirmCrearActualizar(operation: string) {
    this.confirmationService.confirm({
      key: 'agente',
      header: operation === 'op=insertar' ? 'Crear' : 'Actualizar',
      message: operation === 'op=insertar' ? '¿Está seguro de crear el agente?' : '¿Está seguro de actualizar el agente?',
      accept: () => {
        this.confirmCreateOrUpdateAgente(operation);
      }
    });
  }

  private async getAgente() {
    this.activatedRoute.params.subscribe(async params => {
      this.idAgente = params['codigo'];
      if (this.idAgente) {
        await this.getAgenteByCodigo(this.idAgente);
      } else {
        this.formAgente({
          idAgente: '',
          agente: '',
          descripcion: '',
          idUsuario: '',
          idNivelAgente: '1',
          estado: '1', // Valor predeterminado de estado
        });
      }
    });
  }

  private formAgente(data: any): FormGroup {
    const { idAgente, agente, descripcion, idUsuario, idNivelAgente, estado } = data;
    this.agente = new Agente();
    this.isEdicion = !!idAgente;
    this.bloquearEdicion = this.isEdicion;

    this.agenteForm = this.fb.group({
      idAgente: [idAgente],
      agente: [agente, [Validators.required]],
      descripcion: [descripcion],
      idUsuario: [idUsuario],
      idNivelAgente: [idNivelAgente],
      estado: [estado],
      usuario: [idUsuario, Validators.required]
    });

    // Escuchar cambios en el selector de usuario y actualizar idUsuario
    this.agenteForm.get('usuario').valueChanges.subscribe((usuario) => {
      const usuarioId = usuario?.idUsuario || usuario;
      this.agenteForm.get('idUsuario').setValue(usuarioId);
    });

    const usuarioSeleccionado = this.usuarios.find((usuario) => usuario.idUsuario == idUsuario)
    this.agenteForm.get('usuario').setValue(usuarioSeleccionado);
    this.agente = this.agenteForm.value as Agente;
    return this.agenteForm;
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

  private async getAgenteByCodigo(idAgente: number) {
    const formData = new FormData();
    formData.append("idAgente", idAgente.toString());
    try {
      const response = await lastValueFrom(this.postData(formData, 'op=uno'));
      this.formAgente(response);
    } catch (error) {
      console.error('Error al obtener datos del Agente', error);
    }
  }

  public async confirmCreateOrUpdateAgente(operation: string) {
    if (this.agenteForm.valid) {
      const formData = this.createFormData(this.agenteForm.value);
      try {
        const response = await lastValueFrom(this.postData(formData, operation));
        this.formAgente(response);
        await this.getAgente();
        this.router.navigate(['/agente/agente-list']);
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

  public showToast(severity: 'success' | 'error', summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail });
  }

}
