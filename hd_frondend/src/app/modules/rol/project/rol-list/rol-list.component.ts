import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-rol-list',
    templateUrl: './rol-list.component.html',
    styleUrl: './rol-list.component.scss'
})
export class RolListComponent implements OnInit {
    public rol: any;
    public showSearch: boolean;
    public rolesAll: any = [];
    private rolApi = `${environment.apiUrl}/controllers/rol.controller.php?op=todos`;

    constructor(
        private http: HttpClient,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private router: Router,
    ) { }
    ngOnInit() {
        this.loadRoles(); // Llamar al método que carga los datos
    }

    postData(data: any, operation: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/controllers/rol.controller.php?${operation}`, data);
    }

    getRoles(): Observable<any[]> {
        return this.http.get<any[]>(this.rolApi);
    }

    private async loadRoles(): Promise<void> {
        try {
            const data = await lastValueFrom(this.getRoles());
            this.rolesAll = data.map((r) => ({
                idRol: r.idRol,
                nombreRol: r.nombreRol,
                descripcion: r.descripcion,
                descEstado: r.estado === '1' ? 'Activo' : 'Inactivo'
            }));
        } catch (error) {
            console.error('Error al cargar roles', error);
        }
    }

    public showFilter() {
        this.showSearch = !this.showSearch;
    }

    public confirmEliminar(rowData): void {
        this.confirmationService.confirm({
            key: 'rol',
            header: 'Eliminar rol',
            message: `¿Estás seguro de que deseas eliminar a ${rowData.nombreRol}?`,
            accept: () => {
                this.eliminarRol(rowData.idRol);
            }
        });
    }

    private async eliminarRol(idRol: string): Promise<void> {
        const formData = new FormData();
        formData.append("idRol", idRol);

        try {
            const response = await lastValueFrom(this.postData(formData, 'op=eliminar'));
            if (response) {
                if (response.status !== 'error') {
                await this.loadRoles(); // Recargar la tabla
                this.showToast('success', 'Éxito', 'Rol eliminado correctamente.');
            } else {
                this.showToast(
                    'error',
                    'Error',
                    response.message
                );
            }
        }
        } catch (error) {
            console.error('Error al eliminar la rol', error);
            this.showToast('error', 'Error', 'No se pudo eliminar el rol.');
        }
    }

    public showToast(severity: 'success' | 'error', summary: string, detail: string) {
        this.messageService.add({ severity, summary, detail });
    }
}
