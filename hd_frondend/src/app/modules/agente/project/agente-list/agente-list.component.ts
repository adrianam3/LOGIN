import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { lastValueFrom, Observable } from 'rxjs';

@Component({
  selector: 'app-agente-list',
  templateUrl: './agente-list.component.html',
  styleUrl: './agente-list.component.scss'
})
export class AgenteListComponent {
  public agentes: any;
  public showSearch: boolean;
  public agentesAll: any = [];
  private agenteApi = `${environment.apiUrl}/controllers/agente.controller.php?op=todos`;

  constructor(
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadAgentes(); // Llamar al método que carga los datos
  }

  postData(data: any, operation: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/controllers/agente.controller.php?${operation}`, data);
  }

  getAgentes(): Observable<any[]> {
    return this.http.get<any[]>(this.agenteApi);
  }

  private async loadAgentes(): Promise<void> {
    try {
      const data = await lastValueFrom(this.getAgentes());
      this.agentesAll = data.map((u) => ({
        idAgente: u.idAgente,
        agente: u.agente,
        descripcion: u.descripcion,
        idUsuario: u.idUsuario || 'No proporcionado',
        descUsuario: u.agenteNombreCompleto || 'No proporcionado',
        idNivelAgente: u.idNivelAgente || 'No proporcionado',
        descEstado: u.estado === '1' ? 'Activo' : 'Inactivo',
        fechaCreacion: u.fechaCreacion,
      }));

    } catch (error) {
      console.error('Error al cargar agentes', error);
    }
    // (`idAgente`, `agente`, `descripcion`, `idUsuario`, `idNivelAgente`, `estado`, `fechaCreacion`, `fechaModificacion`)
  }

  public showFilter() {
    this.showSearch = !this.showSearch;
  }

  public confirmEliminar(rowData): void {
    this.confirmationService.confirm({
      key: 'agente',
      header: 'Eliminar agente',
      message: `¿Estás seguro de que deseas eliminar a ${rowData.agente}?`,
      accept: () => {
        this.eliminarAgente(rowData.idAgente);
      }
    });
  }

  private async eliminarAgente(idAgente: string): Promise<void> {
    const formData = new FormData();
    formData.append("idAgente", idAgente);

    try {
      const response = await lastValueFrom(this.postData(formData, 'op=eliminar'));
      if (response) {
        await this.loadAgentes(); // Recargar la tabla
        this.showToast('success', 'Éxito', 'Agente eliminado correctamente.');
      }
    } catch (error) {
      console.error('Error al eliminar el Agente', error);
      this.showToast('error', 'Error', 'No se pudo eliminar el agente.');
    }
  }

  public showToast(severity: 'success' | 'error', summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail });
  }

}
