import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-encuesta-list',
  templateUrl: './encuesta-list.component.html',
  styleUrl: './encuesta-list.component.scss'
})
export class EncuestaListComponent implements OnInit {
    public encuestas: any = [];
    public showSearch: boolean = false;
    private encuestaApi = `${environment.apiUrl}/controllers/encuesta.controller.php?op=todos`;

    constructor(
        private http: HttpClient,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.loadEncuestas(); // Cargar las encuestas al iniciar
    }

    postData(data: any, operation: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/controllers/encuesta.controller.php?${operation}`, data);
    }

    getEncuestas(): Observable<any[]> {
        return this.http.get<any[]>(this.encuestaApi);
    }

    private async loadEncuestas(): Promise<void> {
        try {
            const data = await lastValueFrom(this.getEncuestas());
            console.log(data);
            if(data){
            this.encuestas = data.map((e) => ({
                idTicket: e.idTicket,
                idEncuesta: e.idEncuesta,
                titulo: e.titulo,
                nombreAgente: e.nombreAgente,
                fechaEncuesta: e.fechaRespuestaEncuesta,
                nombreUsuario: e.nombreCompletoUsuario,
                puntuacion: e.puntuacion,
                comentarios: e.comentarios,
                descripcion: e.descripcion,
                fechaCreacion: e.fechaCreacion,
                fechaCierre: e.fechaCierre,
            }));
        }
        } catch (error) {
            console.error('Error al cargar encuestas', error);
        }
    }

    public showFilter() {
        this.showSearch = !this.showSearch;
    }

    public confirmEliminar(rowData): void {
        this.confirmationService.confirm({
            key: 'encuesta',
            header: 'Eliminar Encuesta',
            message: `¿Estás seguro de que deseas eliminar la encuesta titulada "${rowData.titulo}"?`,
            accept: () => {
                this.eliminarEncuesta(rowData.idEncuesta);
            }
        });
    }

    private async eliminarEncuesta(idEncuesta: string): Promise<void> {
        const formData = new FormData();
        formData.append("idEncuesta", idEncuesta);

        try {
            const response = await lastValueFrom(this.postData(formData, 'op=eliminar'));
            if (response) {
                await this.loadEncuestas(); // Recargar la tabla
                this.showToast('success', 'Éxito', 'Encuesta eliminada correctamente.');
            }
        } catch (error) {
            console.error('Error al eliminar la encuesta', error);
            this.showToast('error', 'Error', 'No se pudo eliminar la encuesta.');
        }
    }

    public showToast(severity: 'success' | 'error', summary: string, detail: string) {
        this.messageService.add({ severity, summary, detail });
    }
}
