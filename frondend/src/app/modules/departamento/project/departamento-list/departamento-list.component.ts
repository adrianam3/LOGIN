import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-departamento-list',
    templateUrl: './departamento-list.component.html',
    styleUrl: './departamento-list.component.scss'
})
export class DepartamentoListComponent {

    public departamentoUsuario: any;
    public showSearch: boolean;
    public departamentoAll: any = [];
    private departamentoApi = `${environment.apiUrl}/controllers/departamentoagente.controller.php?op=todos`;

    constructor(
        private http: HttpClient,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
    ) { }
    ngOnInit() {
        this.loadDepartamento(); // Llamar al método que carga los datos
    }

    postData(data: any, operation: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/controllers/departamentoagente.controller.php?${operation}`, data);
    }

    getDepartamento(): Observable<any[]> {
        return this.http.get<any[]>(this.departamentoApi);
    }

    private async loadDepartamento(): Promise<void> {
        try {
            const data = await lastValueFrom(this.getDepartamento());
            this.departamentoAll = data.map((au) => ({
                idDepartamentoA: au.idDepartamentoA,
                nombre: au.nombre,
                descripcion: au.descripcion,
                descEstado: au.estado === '1' ? 'Activo' : 'Inactivo'
            }));
        } catch (error) {
            console.error('Error al cargar Departamento', error);
        }
    }

    public showFilter() {
        this.showSearch = !this.showSearch;
    }

    public confirmEliminar(rowData): void {
        this.confirmationService.confirm({
            key: 'departamento',
            header: 'Eliminar Departamento',
            message: `¿Estás seguro de que deseas eliminar a ${rowData.nombre}?`,
            accept: () => {
                this.eliminarDepartamento(rowData.idDepartamentoA);
            }
        });
    }

    private async eliminarDepartamento(idDepartamentoA: string): Promise<void> {
        const formData = new FormData();
        formData.append("idDepartamentoA", idDepartamentoA);

        try {
            const response = await lastValueFrom(this.postData(formData, 'op=eliminar'));
            if (response) {
                await this.loadDepartamento(); // Recargar la tabla
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
