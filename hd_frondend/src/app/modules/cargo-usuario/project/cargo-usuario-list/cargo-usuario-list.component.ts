import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cargo-usuario-list',
  templateUrl: './cargo-usuario-list.component.html',
  styleUrl: './cargo-usuario-list.component.scss'
})
export class CargoUsuarioListComponent {
  public showSearch: boolean;
  public cargoUsuarioAll: any = [];
  private cargoUsuarioApi = `${environment.apiUrl}/controllers/cargousuario.controller.php?op=todos`;

  constructor(
      private http: HttpClient,
      private confirmationService: ConfirmationService,
      private messageService: MessageService,
  ) { }
  ngOnInit() {
      this.loadCargoUsuario(); // Llamar al método que carga los datos
  }

  postData(data: any, operation: string): Observable<any> {
      return this.http.post<any>(`${environment.apiUrl}/controllers/cargousuario.controller.php?${operation}`, data);
  }

  getCargoUsuario(): Observable<any[]> {
      return this.http.get<any[]>(this.cargoUsuarioApi);
  }

  private async loadCargoUsuario(): Promise<void> {
      try {
          const data = await lastValueFrom(this.getCargoUsuario());
          this.cargoUsuarioAll = data.map((au) => ({
              idCargoU: au.idCargoU,
              nombre: au.nombre,
              descripcion: au.descripcion,
              descEstado: au.estado === '1' ? 'Activo' : 'Inactivo'
          }));
      } catch (error) {
          console.error('Error al cargar Cargo de usuario', error);
      }
  }

  public showFilter() {
      this.showSearch = !this.showSearch;
  }

  public confirmEliminar(rowData): void {
      this.confirmationService.confirm({
          key: 'cargoUsuario',
          header: 'Eliminar Cargo de usuario',
          message: `¿Estás seguro de que deseas eliminar a ${rowData.nombre}?`,
          accept: () => {
              this.eliminarCargoUsuario(rowData.idCargoU);
          }
      });
  }

  private async eliminarCargoUsuario(idCargoU: string): Promise<void> {
      const formData = new FormData();
      formData.append("idCargoU", idCargoU);

      try {
          const response = await lastValueFrom(this.postData(formData, 'op=eliminar'));
          if (response) {
              await this.loadCargoUsuario(); // Recargar la tabla
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
