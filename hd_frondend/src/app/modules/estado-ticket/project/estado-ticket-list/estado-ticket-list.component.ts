import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-estado-ticket-list',
  templateUrl: './estado-ticket-list.component.html',
  styleUrl: './estado-ticket-list.component.scss'
})
export class EstadoTicketListComponent {
  public showSearch: boolean;
  public estadoTicketAll: any = [];
  private estadoTicketApi = `${environment.apiUrl}/controllers/estadoticket.controller.php?op=todos`;

  constructor(
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
) { }
ngOnInit() {
  this.loadEstadoTicket(); // Llamar al método que carga los datos
}

postData(data: any, operation: string): Observable<any> {
  return this.http.post<any>(`${environment.apiUrl}/controllers/estadoticket.controller.php?${operation}`, data);
}

getEstadoTicket(): Observable<any[]> {
  return this.http.get<any[]>(this.estadoTicketApi);
}

private async loadEstadoTicket(): Promise<void> {
  try {
      const data = await lastValueFrom(this.getEstadoTicket());
      this.estadoTicketAll = data.map((au) => ({
          idEstadoTicket: au.idEstadoTicket,
          nombre: au.nombre,
          descripcion: au.descripcion,
          descEstado: au.estado === '1' ? 'Activo' : 'Inactivo'
      }));
  } catch (error) {
      console.error('Error al cargar Estado del Ticket', error);
  }
}

public showFilter() {
  this.showSearch = !this.showSearch;
}

public confirmEliminar(rowData): void {
  this.confirmationService.confirm({
      key: 'estadoTicket',
      header: 'Eliminar Estado del Ticket',
      message: `¿Estás seguro de que deseas eliminar a ${rowData.nombre}?`,
      accept: () => {
          this.eliminarEstadoTicket(rowData.idEstadoTicket);
      }
  });
}

private async eliminarEstadoTicket(idEstadoTicket: string): Promise<void> {
  const formData = new FormData();
  formData.append("idEstadoTicket", idEstadoTicket);

  try {
      const response = await lastValueFrom(this.postData(formData, 'op=eliminar'));
      if (response) {
          await this.loadEstadoTicket(); // Recargar la tabla
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

