import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs'; // Importar lastValueFrom
import { environment } from 'src/environments/environment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
    selector: 'app-persona-list',
    templateUrl: './persona-list.component.html',
    styleUrl: './persona-list.component.scss'
})
export class PersonaListComponent implements OnInit {
    public personas: any;
    public showSearch: boolean;
    public personasAll: any = [];
    private personaApi = `${environment.apiUrl}/controllers/persona.controller.php?op=todos`;

    constructor(
        private http: HttpClient,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.loadPersonas(); // Llamar al método que carga los datos
    }

    postData(data: any, operation: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/controllers/persona.controller.php?${operation}`, data);
    }

    getPersonas(): Observable<any[]> {
        return this.http.get<any[]>(this.personaApi);
    }

    private async loadPersonas(): Promise<void> {
        try {
            const data = await lastValueFrom(this.getPersonas());
            this.personasAll = data.map((p) => ({
                idPersona: p.idPersona,
                cedula: p.cedula,
                nombreCompleto: `${p.nombres} ${p.apellidos}`,
                email: p.email,
                direccion: p.direccion || 'No proporcionado',
                celular: p.celular || 'No proporcionado',
                telefono: p.telefono || 'No proporcionado',
                extension: p.extension || 'No proporcionado',
                descEstado: p.estado === '1' ? 'Activo' : 'Inactivo'
            }));
        } catch (error) {
            console.error('Error al cargar personas', error);
        }
    }

    public showFilter() {
        this.showSearch = !this.showSearch;
    }

    public confirmEliminar(rowData): void {
        this.confirmationService.confirm({
            key: 'persona',
            header: 'Eliminar Persona',
            message: `¿Estás seguro de que deseas eliminar a ${rowData.nombreCompleto}?`,
            accept: () => {
                this.eliminarPersona(rowData.idPersona);
            }
        });
    }

    private async eliminarPersona(idPersona: string): Promise<void> {
        const formData = new FormData();
        formData.append("idPersona", idPersona);

        try {
            const response = await lastValueFrom(this.postData(formData, 'op=eliminar'));
            if (response) {
                await this.loadPersonas(); // Recargar la tabla
                this.showToast('success', 'Éxito', 'Persona eliminada correctamente.');
            }
        } catch (error) {
            console.error('Error al eliminar la persona', error);
            this.showToast('error', 'Error', 'No se pudo eliminar la persona.');
        }
    }

    public showToast(severity: 'success' | 'error', summary: string, detail: string) {
        this.messageService.add({ severity, summary, detail });
    }
}
