import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Encuesta } from '../model/Encuesta';
import { DateService } from 'src/app/modules/Services/date.service';

@Component({
    selector: 'app-encuesta-form',
    templateUrl: './encuesta-form.component.html',
    styleUrl: './encuesta-form.component.scss',
})
export class EncuestaFormComponent implements OnInit {
    public value!: number;
    public calificacion: number = 0;
    public comentario: string = '';
    public items = Array.from({ length: 10 }, (_, i) => i);
    public activeItem: number = -1;
    public encuestaForm: FormGroup;
    public idTicket: number;
    public idUsuario: string;
    public idRol: string;
    public email: string;
    public nombreCompleto: string;
    public fechaActual: string;
    public encuesta: Encuesta;
    public ticketDetails;
    public loading: boolean = false;

    constructor(
        private router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private http: HttpClient,
        private dateService: DateService
    ) {}

    ngOnInit() {
        this.fechaActual = this.dateService.obtenerFechaActualFormateada();
        this.loadData();
    }

    public async loadData() {
        this.activatedRoute.params.subscribe(async (params) => {
            this.idTicket = params['codigo'];
            if (this.idTicket) {
                await this.getTicketByCodigo(this.idTicket);
            }
        });
        await this.getTicketByCodigo(this.idTicket);
    }

    public confirmVolver() {
        this.confirmationService.confirm({
            key: 'encuesta',
            header: 'Cancelar',
            message: '¿Está seguro de cancelar respuesta a la Encuesta?',
            accept: () => {
                this.router.navigate(['/ticket/ticket-list']);
            },
            reject: () => {},
        });
    }

    public onChangeRaiting(index: number) {
        this.activeItem = index;
        this.calificacion = index + 1;
        console.log(this.activeItem);
    }

    private async getTicketByCodigo(idTicket: number) {
        const formData = new FormData();
        formData.append('idTicket', idTicket.toString());
        try {
            const response = await lastValueFrom(
                this.postData(formData, 'op=uno')
            );
            this.formTicket(response);
        } catch (error) {
            console.error('Error al obtener datos del Ticket', error);
        }
    }

    postData(data: any, operation: string): Observable<any> {
        return this.http.post(
            `${environment.apiUrl}/controllers/ticket.controller.php?${operation}`,
            data
            // {
            //     withCredentials: true,
            //     responseType: 'text'
            // }
        );
    }

    postDataEncuesta(data: any, operation: string): Observable<any> {
        return this.http.post(
            `${environment.apiUrl}/controllers/encuesta.controller.php?${operation}`,
            data
            // {
            //     withCredentials: true,
            //     responseType: 'text'
            // }
        );
    }

    private formTicket(data: any): FormGroup {
        this.ticketDetails = {
            idTicket: data.idTicket,
            titulo: data.titulo,
            descripcion: data.descripcion,
            nombreUsuario: data.personaNombres + ' ' + data.personaApellidos,
            email: data.email,
            departamentoA: data.departamentoANombre,
            estadoTicket: data.estadoTicketNombre,
            fechaCreacion: data.fechaCreacion,
            fechaCierre: data.fechaCierre,
            nombreAgente: data.agenteNombres + ' ' + data.agenteApellidos,
        };
        // Recuperar idUsuario de localStorage
        this.idUsuario = localStorage.getItem('idUsuario');
        this.email = localStorage.getItem('email');
        this.nombreCompleto = `${localStorage.getItem(
            'nombres'
        )} ${localStorage.getItem('apellidos')}`;
        this.encuestaForm = this.fb.group({
            idTicket: [this.idTicket],
            idUsuario: [this.idUsuario],
            puntuacion: [this.calificacion],
            comentarios: [this.comentario],
            fechaEnvioEncuesta: [this.fechaActual],
            fechaRespuestaEncuesta: [this.fechaActual],
        });
        return this.ticketDetails;
    }

    public confirmCrear() {
        this.confirmationService.confirm({
            key: 'encuesta',
            header: 'Crear',
            message: '¿Está seguro de guardar la Encuesta?',
            accept: () => {
                this.createEncuesta();
            },
        });
    }

    private async createEncuesta() {
        this.loading = true;
        if (this.calificacion === 0) {
            this.showToast(
                'warn',
                'Advertencia',
                'La calificación debe ser diferente de cero.'
            );
            this.loading = false;
        } else {
            if (this.encuestaForm.valid) {
                this.encuestaForm
                    .get('fechaRespuestaEncuesta')
                    .setValue(this.fechaActual);
                this.encuestaForm
                    .get('fechaEnvioEncuesta')
                    .setValue(this.fechaActual);
                this.encuestaForm.get('puntuacion').setValue(this.calificacion);
                const formData = this.createFormData(this.encuestaForm.value);
                try {
                    await lastValueFrom(
                        this.postDataEncuesta(formData, 'op=insertar')
                    );
                    setTimeout(() => {
                        this.showToast(
                            'success',
                            'Éxito',
                            'La operación se realizó correctamente.'
                        );
                    }, 200);
                    this.router.navigate(['/ticket/ticket-list']);
                } catch (error) {
                    console.error('Error:', error);
                    this.showToast(
                        'error',
                        'Error',
                        'Ocurrió un error al realizar la operación.'
                    );
                } finally {
                    this.loading = false;
                }
            } else {
                this.loading = false;
                this.showToast(
                    'error',
                    'Error',
                    'Complete los campos obligatorios para guardar.'
                );
            }
        }
    }

    private showToast(
        severity: 'success' | 'error' | 'warn',
        summary: string,
        detail: string
    ) {
        this.messageService.add({ severity, summary, detail });
    }

    private createFormData(data: any): FormData {
        const formData = new FormData();
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                formData.append(key, data[key]);
            }
        }
        return formData;
    }
}
