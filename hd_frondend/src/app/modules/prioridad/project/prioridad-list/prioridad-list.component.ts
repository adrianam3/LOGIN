import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-prioridad-list',
  templateUrl: './prioridad-list.component.html',
  styleUrl: './prioridad-list.component.scss'
})
export class PrioridadListComponent {
  public showSearch: boolean;
  public prioridadAll: any = [];
  private prioridadApi = `${environment.apiUrl}/controllers/prioridad.controller.php?op=todos`;

  constructor(
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
) { }
ngOnInit() {
  this.loadPrioridad(); // Llamar al método que carga los datos
}

postData(data: any, operation: string): Observable<any> {
  return this.http.post<any>(`${environment.apiUrl}/controllers/prioridad.controller.php?${operation}`, data);
}

getPrioridad(): Observable<any[]> {
  return this.http.get<any[]>(this.prioridadApi);
}

private async loadPrioridad(): Promise<void> {
  try {
      const data = await lastValueFrom(this.getPrioridad());
      this.prioridadAll = data.map((au) => ({
          idPrioridad: au.idPrioridad,
          nombre: au.nombre,
          descripcion: au.descripcion,
          descEstado: au.estado === '1' ? 'Activo' : 'Inactivo'
      }));
  } catch (error) {
      console.error('Error al cargar Prioridad', error);
  }
}

public showFilter() {
  this.showSearch = !this.showSearch;
}

public confirmEliminar(rowData): void {
  this.confirmationService.confirm({
      key: 'prioridad',
      header: 'Eliminar Prioridad',
      message: `¿Estás seguro de que deseas eliminar a ${rowData.nombre}?`,
      accept: () => {
          this.eliminarPrioridad(rowData.idPrioridad);
      }
  });
}

private async eliminarPrioridad(idPrioridad: string): Promise<void> {
  const formData = new FormData();
  formData.append("idPrioridad", idPrioridad);

  try {
      const response = await lastValueFrom(this.postData(formData, 'op=eliminar'));
      if (response) {
          await this.loadPrioridad(); // Recargar la tabla
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

