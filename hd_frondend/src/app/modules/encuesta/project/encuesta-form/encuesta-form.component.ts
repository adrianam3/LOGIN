import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { cn } from '@fullcalendar/core/internal-common';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { lastValueFrom, Observable } from 'rxjs';
import { Ticket } from 'src/app/modules/ticket/project/model/Ticket';
import { environment } from 'src/environments/environment';
import { Encuesta } from '../model/Encuesta';
import { DateService } from 'src/app/modules/Services/date.service';

@Component({
    selector: 'app-encuesta-form',
    templateUrl: './encuesta-form.component.html',
    styleUrl: './encuesta-form.component.scss'
})
export class EncuestaFormComponent implements OnInit {
    public value!: number;
    public comentario: string = '';
    public items = Array.from({ length: 10 }, (_, i) => i);
    public activeItem: number = -1;
    public ticketForm: FormGroup;
    public idTicket: number;
    public ticket: Ticket;
    public idUsuario: string;
    public idRol: string;
    public email: string;
    public nombreCompleto: string;
    public fechaActual: string;
    public encuesta: Encuesta;
    ticketForm2: FormGroup;

    ticketDetails;

    constructor(
        private router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private fb2: FormBuilder,
        private http: HttpClient,
        private dateService: DateService
    ) { }

    ngOnInit() {
        this.fechaActual = this.dateService.obtenerFechaActualFormateada();
        console.log(this.fechaActual);
        this.loadData();
        this.ticketDetails = {
            agenteApellidos: "Martínez",
            agenteNombres: "Pedro",
            departamentoANombre: "Soporte Compras",
            descripcion: "Prueba Actualizar",
            estadoTicketNombre: "Abierto",
            fechaAtualizacion: "2024-09-13 11:42:29",
            fechaCierre: null,
            fechaCreacion: "2024-09-13 06:01:12",
            fechaInicioAtencion: null,
            fechaPrimeraRespuesta: null,
            fechaReapertura: null,
            fechaUltimaRespuesta: null,
            idAgente: "9",
            idDepartamentoA: "2",
            idEstadoTicket: "1",
            idPrioridad: "1",
            idSla: "6",
            idTemaAyuda: "1",
            idTicket: "92",
            idUsuario: "1",
            idfuenteContacto: "1",
            personaApellidos: "Pérez Ruiz",
            personaNombres: "Juan",
            prioridadNombre: "Normal",
            resueltoPrimerContacto: "1",
            slaNombre: "SLA 48 Horas",
            titulo: "Prueba Actualizar"
          };
        this.ticketForm2 = this.fb2.group({
            agenteApellidos: [{ value: 'Martínez', disabled: true }],
            agenteNombres: [{ value: 'Pedro', disabled: true }],
            departamentoANombre: [{ value: 'Soporte Compras', disabled: true }],
            descripcion: [{ value: 'Prueba Actualizar', disabled: true }],
            estadoTicketNombre: [{ value: 'Abierto', disabled: true }],
            fechaAtualizacion: [{ value: '2024-09-13 11:42:29', disabled: true }],
            fechaCierre: [{ value: null, disabled: true }],
            fechaCreacion: [{ value: '2024-09-13 06:01:12', disabled: true }],
            fechaInicioAtencion: [{ value: null, disabled: true }],
            fechaPrimeraRespuesta: [{ value: null, disabled: true }],
            fechaReapertura: [{ value: null, disabled: true }],
            fechaUltimaRespuesta: [{ value: null, disabled: true }],
            idAgente: [{ value: '9', disabled: true }],
            idDepartamentoA: [{ value: '2', disabled: true }],
            idEstadoTicket: [{ value: '1', disabled: true }],
            idPrioridad: [{ value: '1', disabled: true }],
            idSla: [{ value: '6', disabled: true }],
            idTemaAyuda: [{ value: '1', disabled: true }],
            idTicket: [{ value: '92', disabled: true }],
            idUsuario: [{ value: '1', disabled: true }],
            idfuenteContacto: [{ value: '1', disabled: true }],
            personaApellidos: [{ value: 'Pérez Ruiz', disabled: true }],
            personaNombres: [{ value: 'Juan', disabled: true }],
            prioridadNombre: [{ value: 'Normal', disabled: true }],
            resueltoPrimerContacto: [{ value: '1', disabled: true }],
            slaNombre: [{ value: 'SLA 48 Horas', disabled: true }],
            titulo: [{ value: 'Prueba Actualizar', disabled: true }]
          });
    }

    public async loadData() {
        // this.activatedRoute.params.subscribe(async params => {
        //     this.idTicket = params['codigo'];
        //     if (this.idTicket) {
        //         await this.getTicketByCodigo(this.idTicket);
        //     }
        // });
        this.idTicket = 92;
        await this.getTicketByCodigo(this.idTicket);
    }

    public confirmVolver() {
        this.confirmationService.confirm({
            key: 'rol',
            header: 'Cancelar',
            message: '¿Está seguro de cancelar la Encuesta?',
            accept: () => {
                this.router.navigate(['/rol/rol-list']);
            },
            reject: () => {
            }
        });
    }

    public onActiveItemChange(index: number) {
        this.activeItem = index;
        console.log(this.activeItem);
    }

    private async getTicketByCodigo(idTicket: number) {
        const formData = new FormData();
        formData.append("idTicket", idTicket.toString());
        try {
            const response = await lastValueFrom(this.postData(formData, 'op=uno'));
            this.formTicket(response);
            // const agenteSeleccionado = this.agentes.find((agente) => agente.idAgente == response.idAgente)
            // this.ticketForm.get('agente').setValue(agenteSeleccionado);
            console.log(response);
        } catch (error) {
            console.error('Error al obtener datos del Ticket', error);
        }
    }

    postData(data: any, operation: string): Observable<any> {
        return this.http.post(
            `${environment.apiUrl}/controllers/ticket.controller.php?${operation}`,
            data,
            // {
            //     withCredentials: true,
            //     responseType: 'text'
            // }
        );
    }

    private formTicket(data: any): FormGroup {
        const { idTicket, titulo, descripcion,
            idSla, idPrioridad, idDepartamentoA,
            idEstadoTicket, idAgente,
            resueltoPrimerContacto, idfuenteContacto,
            idTemaAyuda, fechaInicioAtencion,
            fechaAtualizacion,
        } = data;
        this.ticket = new Ticket();
        // Recuperar idUsuario de localStorage
        this.idUsuario = localStorage.getItem('idUsuario');
        this.email = localStorage.getItem('email');
        this.nombreCompleto = `${localStorage.getItem('nombres')} ${localStorage.getItem('apellidos')}`;
        return this.ticketForm;
    }
}
