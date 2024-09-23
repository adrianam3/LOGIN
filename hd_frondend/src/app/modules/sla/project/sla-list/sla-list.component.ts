import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sla-list',
  templateUrl: './sla-list.component.html',
  styleUrl: './sla-list.component.scss'
})
export class SlaListComponent {
  public showSearch: boolean;
  public slaAll: any = [];
  private slaApi = `${environment.apiUrl}/controllers/sla.controller.php?op=todos`;

  constructor(
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
) { }
ngOnInit() {
  this.loadSla(); // Llamar al método que carga los datos
}

postData(data: any, operation: string): Observable<any> {
  return this.http.post<any>(`${environment.apiUrl}/controllers/sla.controller.php?${operation}`, data);
}

getSla(): Observable<any[]> {
  return this.http.get<any[]>(this.slaApi);
}

private async loadSla(): Promise<void> {
  try {
      const data = await lastValueFrom(this.getSla());
      //console.log(data);
      this.slaAll = data.map((au) => ({
          idSla: au.idSla,
          nombre: au.nombre,
          tiempoRespuesta: au.tiempoRespuesta,
          idPrioridad: au.idPrioridad,
          prioridadNombre: au.prioridadNombre,
          descEstado: au.estado === '1' ? 'Activo' : 'Inactivo'
      }));
  } catch (error) {
      console.error('Error al cargar SLA', error);
  }
}

public showFilter() {
  this.showSearch = !this.showSearch;
}

public confirmEliminar(rowData): void {
  this.confirmationService.confirm({
      key: 'sla',
      header: 'Eliminar SLA',
      message: `¿Estás seguro de que deseas eliminar a ${rowData.nombre}?`,
      accept: () => {
          this.eliminarSla(rowData.idSla);
      }
  });
}

private async eliminarSla(idSla: string): Promise<void> {
  const formData = new FormData();
  formData.append("idSla", idSla);

  try {
      const response = await lastValueFrom(this.postData(formData, 'op=eliminar'));
      if (response) {
          await this.loadSla(); // Recargar la tabla
          this.showToast('success', 'Éxito', 'Area eliminada correctamente.');
      }
  } catch (error) {
      console.error('Error al eliminar el area', error);
      this.showToast('error', 'Error', 'No se pudo eliminar el Area.');
  }
}

public showToast(severity: 'success' | 'error', summary: string, detail: string) {
  this.messageService.add({ severity, summary, detail });
}
}

