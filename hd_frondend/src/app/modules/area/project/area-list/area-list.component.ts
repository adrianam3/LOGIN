import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-area-list',
    templateUrl: './area-list.component.html',
    styleUrl: './area-list.component.scss'
})
export class AreaListComponent {

    public areaUsuario: any;
    public showSearch: boolean;
    public areaUsuarioAll: any = [];
    private areaUsuarioApi = `${environment.apiUrl}/controllers/areausuario.controller.php?op=todos`;

    constructor(
        private http: HttpClient,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
    ) { }
    ngOnInit() {
        this.loadAreaUsuario(); // Llamar al método que carga los datos
    }

    postData(data: any, operation: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/controllers/areausuario.controller.php?${operation}`, data);
    }

    getAreaUsuario(): Observable<any[]> {
        return this.http.get<any[]>(this.areaUsuarioApi);
    }

    private async loadAreaUsuario(): Promise<void> {
        try {
            const data = await lastValueFrom(this.getAreaUsuario());
            this.areaUsuarioAll = data.map((au) => ({
                idAreaU: au.idAreaU,
                nombre: au.nombre,
                descripcion: au.descripcion,
                descEstado: au.estado === '1' ? 'Activo' : 'Inactivo'
            }));
        } catch (error) {
            console.error('Error al cargar areaUsuario', error);
        }
    }

    public showFilter() {
        this.showSearch = !this.showSearch;
    }

    public confirmEliminar(rowData): void {
        this.confirmationService.confirm({
            key: 'areaUsuario',
            header: 'Eliminar areaUsuario',
            message: `¿Estás seguro de que deseas eliminar a ${rowData.nombre}?`,
            accept: () => {
                this.eliminarAreaUsuario(rowData.idAreaU);
            }
        });
    }

    private async eliminarAreaUsuario(idAreaU: string): Promise<void> {
        const formData = new FormData();
        formData.append("idAreaU", idAreaU);

        try {
            const response = await lastValueFrom(this.postData(formData, 'op=eliminar'));
            if (response) {
                await this.loadAreaUsuario(); // Recargar la tabla
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
