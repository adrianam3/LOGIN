import { Component } from '@angular/core';
import { Usuario } from '../model/Usuario';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { lastValueFrom, Observable } from 'rxjs';

@Component({
    selector: 'app-usuario-list',
    templateUrl: './usuario-list.component.html',
    styleUrl: './usuario-list.component.scss'
})
export class UsuarioListComponent {

    public usuarios: any;
    public showSearch: boolean;
    public usuariosAll: any = [];
    private usuarioApi = `${environment.apiUrl}/controllers/usuario.controller.php?op=todos`;

    constructor(
        private http: HttpClient,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.loadUsuarios(); // Llamar al método que carga los datos
    }

    postData(data: any, operation: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/controllers/usuario.controller.php?${operation}`, data);
    }

    getUsuarios(): Observable<any[]> {
        return this.http.get<any[]>(this.usuarioApi);
    }

    private async loadUsuarios(): Promise<void> {
        try {
            const data = await lastValueFrom(this.getUsuarios());
            this.usuariosAll = data.map((u) => ({
                idUsuario: u.idUsuario,
                nombreCompleto: `${u.personaNombres} ${u.personaApellidos}`,
                descRol: u.rolNombre,
                descArea: u.areaNombre,
                email: u.personaEmail,
                fechaCreacion: u.fechaCreacion,
                usuario: u.usuario,
                password: u.password,
                descripcion: u.descripcion,
                idPersona: u.idPersona || 'No proporcionado',
                idAreaU: u.idAreaU || 'No proporcionado',
                idRol: u.idRol || 'No proporcionado',
                idCargoU: u.idCargoU || 'No proporcionado',
                descEstado: u.estado === '1' ? 'Activo' : 'Inactivo'
            }));
        } catch (error) {
            console.error('Error al cargar usuarios', error);
        }
    }

    public showFilter() {
        this.showSearch = !this.showSearch;
    }

    public confirmEliminar(rowData): void {
        this.confirmationService.confirm({
            key: 'usuario',
            header: 'Eliminar Usuario',
            message: `¿Estás seguro de que deseas eliminar a ${rowData.usuario}?`,
            accept: () => {
                this.eliminarUsuario(rowData.idUsuario);
            }
        });
    }

    private async eliminarUsuario(idUsuario: string): Promise<void> {
        const formData = new FormData();
        formData.append("idUsuario", idUsuario);

        try {
            const response = await lastValueFrom(this.postData(formData, 'op=eliminar'));
            if (response) {
                await this.loadUsuarios(); // Recargar la tabla
                this.showToast('success', 'Éxito', 'Usuario eliminado correctamente.');
            }
        } catch (error) {
            console.error('Error al eliminar el usuario', error);
            this.showToast('error', 'Error', 'No se pudo eliminar el usuario.');
        }
    }

    public showToast(severity: 'success' | 'error', summary: string, detail: string) {
        this.messageService.add({ severity, summary, detail });
    }

}
