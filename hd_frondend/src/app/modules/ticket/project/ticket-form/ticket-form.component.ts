import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ticket } from '../model/Ticket';
import { TicketDetalle } from '../model/Ticket-Detalle';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { lastValueFrom, Observable } from 'rxjs';
import { ValidarRolesService } from 'src/app/modules/core/validar-roles.service';

@Component({
    selector: 'app-ticket-form',
    templateUrl: './ticket-form.component.html',
    styleUrl: './ticket-form.component.scss',
})
export class TicketFormComponent implements OnInit {
    public ticketForm: FormGroup;
    public ticket: Ticket;
    public isEdicion: boolean;
    public bloquearEdicion: boolean;
    public slas: any = [];
    public prioridades: any = [];
    public departamentoAgentes: any = [];
    public estadoTickets: any = [];
    private idTicket: number;
    public fechaInicioAtencionExists: boolean = false;
    public idUsuario: string;
    public idRol: string;
    public email: string;
    public nombreCompleto: string;
    public estadoTicketId: string = '1'; // Valor predeterminado inicial Ticket - Abierto = 1
    public prioridadId: string = '1'; // Valor predeterminado inicial Prioridad - Normal = 1
    public slaId: string = '1'; // Valor predeterminado inicial SLA - 1hora = 1
    public temaAyudaId: string = '1';
    public fuenteContactoId: string = '1';
    public resueltoPrimerContactoId: number = 1;
    public agentes: any[] = [];
    public mensajes: any[] = [];
    public temasAyuda: any = [];

    public ticketDetalleForm: FormGroup;
    public ticketDetalle: TicketDetalle;
    private idTicketDetalle: number;
    public tipoDetalle: string = '1'; // Valor predeterminado inicial Ticket - Abierto = 1
    public loading: boolean = false;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private http: HttpClient,
        public validarRol: ValidarRolesService
    ) {}

    ngOnInit(): void {
        this.loadData();
    }

    postData(data: any, operation: string): Observable<any> {
        return this.http.post(
            `${environment.apiUrl}/controllers/ticket.controller.php?${operation}`,
            data,
            {
                withCredentials: true,
            }
        );
    }

    private slaApi = `${environment.apiUrl}/controllers/sla.controller.php?op=todos`;
    getSla(): Observable<any[]> {
        return this.http.get<any[]>(this.slaApi);
    }

    private prioridadApi = `${environment.apiUrl}/controllers/prioridad.controller.php?op=todos`;
    getPrioridad(): Observable<any[]> {
        return this.http.get<any[]>(this.prioridadApi);
    }

    private departamentoAgenteApi = `${environment.apiUrl}/controllers/departamentoagente.controller.php?op=todos`;
    getDepartamentoAgente(): Observable<any[]> {
        return this.http.get<any[]>(this.departamentoAgenteApi);
    }

    private estadoTicketApi = `${environment.apiUrl}/controllers/estadoticket.controller.php?op=todos`;
    getEstadoTicket(): Observable<any[]> {
        return this.http.get<any[]>(this.estadoTicketApi);
    }

    private agenteApi = `${environment.apiUrl}/controllers/agente.controller.php?op=todosByDepartamento`;
    getAgentes(idDepartamentoA): Observable<any[]> {
        return this.http.get<any[]>(
            `${this.agenteApi}&idDepartamentoA=${idDepartamentoA}`
        );
    }

    private ticketDetalleApi = `${environment.apiUrl}/controllers/ticketdetalle.controller.php?op=todos`;
    getTicketDetalle(idTicket): Observable<any[]> {
        return this.http.get<any[]>(
            `${this.ticketDetalleApi}&idTicket=${idTicket}`
        );
    }

    // Obtener tema de ayuda
    private temaAyudaApi = `${environment.apiUrl}/controllers/temaayuda.controller.php?op=todos`;
    getTemaAyuda(): Observable<any[]> {
        return this.http.get<any[]>(this.temaAyudaApi);
    }

    postTicketDetalleData(data: any, operation: string): Observable<any> {
        return this.http.post(
            `${environment.apiUrl}/controllers/ticketdetalle.controller.php?${operation}`,
            data,
            {
                withCredentials: true,
            }
        );
    }

    async seleccionarDepartamento(event) {
        const departamentoAId = event.value.idDepartamentoA;
        const agentes = await lastValueFrom(this.getAgentes(departamentoAId));
        this.agentes = agentes;
    }

    public async loadData() {
        await this.loadEntities([
            {
                apiCall: this.getSla(),
                property: 'slas',
                mapFunction: (sla: any) => sla.nombre,
            },
            {
                apiCall: this.getPrioridad(),
                property: 'prioridades',
                mapFunction: (prioridad: any) => prioridad.nombre,
            },
            {
                apiCall: this.getDepartamentoAgente(),
                property: 'departamentoAgentes',
                mapFunction: (departamentoAgente: any) =>
                    departamentoAgente.nombre,
            },
            {
                apiCall: this.getEstadoTicket(),
                property: 'estadoTickets',
                mapFunction: (estadoTicket: any) => estadoTicket.nombre,
            },
            {
                apiCall: this.getTemaAyuda(),
                property: 'temasAyuda',
                mapFunction: (temaAyuda: any) => temaAyuda.nombre,
            }, //
        ]);
        this.activatedRoute.params.subscribe(async (params) => {
            this.idTicket = params['codigo'];
        });
        if (this.idTicket) {
            await this.loadEntities([
                {
                    apiCall: this.getTicketDetalle(this.idTicket),
                    property: 'mensajes',
                    mapFunction: (ticketdetalle: any) => ticketdetalle.detalle,
                },
            ]);
        }
        if (
            this.departamentoAgentes &&
            this.departamentoAgentes.idDepartamentoA
        ) {
            await this.loadEntities([
                {
                    apiCall: this.getAgentes(
                        this.departamentoAgentes.idDepartamentoA
                    ),
                    property: 'agentes',
                    mapFunction: (agente: any) => agente.agente,
                },
            ]);
        }
        this.getTicket();
    }

    private async loadEntities(
        entities: Array<{
            apiCall: Observable<any[]>;
            property: string;
            mapFunction: (item: any) => string;
        }>
    ) {
        for (const entity of entities) {
            const params = await lastValueFrom(entity.apiCall);

            // Verifica si 'params' no es null o undefined
            if (params && Array.isArray(params)) {
                this[entity.property] = params.map((item) => {
                    item.nombreCompleto = entity.mapFunction(item);
                    return item;
                });
            } else {
                // Maneja el caso cuando 'params' es null o undefined
                this[entity.property] = [];
                console.warn(`No data returned for ${entity.property}`);
            }
        }
    }

    public confirmVolver() {
        this.confirmationService.confirm({
            key: 'ticket',
            header: 'Cancelar',
            message: '¿Está seguro de cancelar la edición del ticket?',
            accept: () => {
                this.router.navigate(['/ticket/ticket-list']);
            },
            reject: () => {},
        });
    }

    public fechaInicioAtencion(ticket: any) {
        this.confirmationService.confirm({
            key: 'ticket',
            header: 'Iniciar',
            message: '¿Está seguro de iniciar la atención del ticket?',
            accept: () => {
                const fechaActual = new Date()
                    .toLocaleString('sv-SE', { timeZone: 'America/Guayaquil' })
                    .replace('T', ' ');
                this.ticketForm.patchValue({
                    fechaInicioAtencion: fechaActual,
                });
                this.ticketForm.patchValue({ idEstadoTicket: 3 });
                this.confirmCreateOrUpdateTicket('op=actualizar');
                if (this.validarRol.agente()) {
                    location.reload();
                }
            },
        });
    }

    public confirmCrearActualizar(operation: string) {
        this.confirmationService.confirm({
            key: 'ticket',
            header: operation === 'op=insertar' ? 'Crear' : 'Actualizar',
            message:
                operation === 'op=insertar'
                    ? '¿Está seguro de crear el ticket?'
                    : '¿Está seguro de actualizar el ticket?',
            accept: () => {
                this.confirmCreateOrUpdateTicket(operation);
            },
        });
    }

    private async getTicket() {
        this.activatedRoute.params.subscribe(async (params) => {
            this.idTicket = params['codigo'];
            if (this.idTicket) {
                await this.getTicketByCodigo(this.idTicket);
                await this.formTicketDetalle();
            } else {
                this.formTicket({
                    idTicket: '',
                    titulo: '',
                    descripcion: '',
                    idSla: this.slaId,
                    idPrioridad: this.prioridadId,
                    idDepartamentoA: '',
                    idEstadoTicket: this.estadoTicketId,
                    idAgente: '',
                    idUsuario: '',
                    resueltoPrimerContacto: this.resueltoPrimerContactoId,
                    idTemaAyuda: this.temaAyudaId,
                    idfuenteContacto: this.fuenteContactoId,
                    fechaInicioAtencion: '',
                    fechaAtualizacion: '',
                    fechaCreacion: '',
                });
            }
        });
    }

    private formTicket(data: any): FormGroup {
        const {
            idTicket,
            titulo,
            descripcion,
            idSla,
            idPrioridad,
            idDepartamentoA,
            idEstadoTicket,
            idAgente,
            resueltoPrimerContacto,
            idfuenteContacto,
            idTemaAyuda,
            fechaAtualizacion,
            fechaInicioAtencion,
            fechaCreacion,
            fechaPrimeraRespuesta
        } = data;
        this.ticket = new Ticket();
        this.isEdicion = !!idTicket;
        this.bloquearEdicion = this.isEdicion; // Bloquear edición si es un modo de edición

        // Recuperar idUsuario de localStorage
        this.idUsuario = localStorage.getItem('idUsuario');
        this.email = localStorage.getItem('email');
        this.nombreCompleto = `${localStorage.getItem(
            'nombres'
        )} ${localStorage.getItem('apellidos')}`;

        // 1 Administrador, 2 Usuario, 3 Agente, 4 Coordinador
        this.ticketForm = this.fb.group({
            idTicket: [idTicket],
            emailUsuario: [this.email],
            nombreUsuario: [this.nombreCompleto],
            titulo: [
                titulo,
                this.validarRol.administrador() || this.validarRol.usuario()
                    ? Validators.required
                    : null,
            ],
            descripcion: [
                descripcion,
                this.validarRol.administrador() || this.validarRol.usuario()
                    ? Validators.required
                    : null,
            ],
            idSla: [idSla],
            idPrioridad: [idPrioridad],
            idDepartamentoA: [idDepartamentoA],
            idEstadoTicket: [idEstadoTicket],
            idAgente: [idAgente],
            idfuenteContacto: [idfuenteContacto],
            resueltoPrimerContacto: [resueltoPrimerContacto],
            idUsuario: [this.idUsuario], // Inicio obligatoria
            idTemaAyuda: [idTemaAyuda],
            temaAyuda: [idTemaAyuda],
            sla: [
                idSla,
                this.validarRol.administrador() ||
                this.validarRol.agente() ||
                this.validarRol.coordinador()
                    ? Validators.required
                    : null,
            ],
            prioridad: [
                idPrioridad,
                this.validarRol.administrador() ||
                this.validarRol.agente() ||
                this.validarRol.coordinador()
                    ? Validators.required
                    : null,
            ],
            departamentoAgente: [
                idDepartamentoA,
                this.validarRol.administrador() ||
                this.validarRol.agente() ||
                this.validarRol.coordinador()
                    ? Validators.required
                    : null,
            ],
            estadoTicket: [
                idEstadoTicket,
                this.validarRol.administrador() ||
                this.validarRol.agente() ||
                this.validarRol.coordinador()
                    ? Validators.required
                    : null,
            ],
            agente: [
                idAgente,
                this.validarRol.administrador() ||
                this.validarRol.agente() ||
                this.validarRol.coordinador()
                    ? Validators.required
                    : null,
            ],
            fechaAtualizacion: [fechaAtualizacion],
            fechaInicioAtencion: [fechaInicioAtencion],
            fechaCreacion: [fechaCreacion],
            fechaPrimeraRespuesta: [fechaPrimeraRespuesta]
        });
        // Escuchar cambios en el selector de SLA y actualizar idSla
        const slaControl = this.ticketForm.get('sla');
        if (slaControl) {
            slaControl.valueChanges.subscribe((sla) => {
                const slaId = sla?.idSla || sla;
                this.ticketForm.get('idSla').setValue(slaId);
            });
        }
        const slaSeleccionada = this.slas.find((sla) => sla.idSla == idSla);
        this.ticketForm.get('sla').setValue(slaSeleccionada);

        // Escuchar cambios en el selector de Tema de Ayuda y actualizar idTemaAyuda
        const temaAyudaControl = this.ticketForm.get('temaAyuda');
        if (temaAyudaControl) {
            temaAyudaControl.valueChanges.subscribe((temaAyuda) => {
                const temaAyudaId = temaAyuda?.idTemaAyuda || temaAyuda;
                this.ticketForm.get('idTemaAyuda').setValue(temaAyudaId);
            });
        }
        const temAyudaSeleccionada = this.temasAyuda.find(
            (temaAyuda) => temaAyuda.idTemaAyuda == idTemaAyuda
        );
        this.ticketForm.get('temaAyuda').setValue(temAyudaSeleccionada);

        // Escuchar cambios en el selector de Prioridad y actualizar idPrioridad
        this.ticketForm.get('prioridad').valueChanges.subscribe((prioridad) => {
            const prioridadId = prioridad?.idPrioridad || prioridad;
            this.ticketForm.get('idPrioridad').setValue(prioridadId);
        });
        const prioridadSeleccionada = this.prioridades.find(
            (prioridad) => prioridad.idPrioridad == idPrioridad
        );
        this.ticketForm.get('prioridad').setValue(prioridadSeleccionada);

        // Escuchar cambios en el selector de DepartamentoAgente y actualizar idDepartamentoA
        this.ticketForm
            .get('departamentoAgente')
            .valueChanges.subscribe((departamentoAgente) => {
                const departamentoAgenteId =
                    departamentoAgente?.idDepartamentoA || departamentoAgente;
                this.ticketForm
                    .get('idDepartamentoA')
                    .setValue(departamentoAgenteId);
            });
        const departamentoAgenteSeleccionado = this.departamentoAgentes.find(
            (departamentoAgente) =>
                departamentoAgente.idDepartamentoA == idDepartamentoA
        );
        this.ticketForm
            .get('departamentoAgente')
            .setValue(departamentoAgenteSeleccionado);

        // Escuchar cambios en el selector de estadoTicket y actualizar idEstadoTicket
        this.ticketForm
            .get('estadoTicket')
            .valueChanges.subscribe((estadoTicket) => {
                const estadoTicketId =
                    estadoTicket?.idEstadoTicket || estadoTicket;
                this.ticketForm.get('idEstadoTicket').setValue(estadoTicketId);
            });
        const estadoTicketSeleccionada = this.estadoTickets.find(
            (estadoTicket) => estadoTicket.idEstadoTicket == idEstadoTicket
        );
        this.ticketForm.get('estadoTicket').setValue(estadoTicketSeleccionada);
        // Verificar si ya existe un departamento al cargar el formulario
        if (idDepartamentoA) {
            this.getAgentes(idDepartamentoA).subscribe((agentes) => {
                this.agentes = agentes;
                const agenteSeleccionado = this.agentes.find(
                    (agente) => agente.idAgente == idAgente
                );
                this.ticketForm.get('agente').setValue(agenteSeleccionado);
            });
        }
        // Escuchar cambios en el selector de Agente y actualizar idAgente
        this.ticketForm.get('agente').valueChanges.subscribe((agente) => {
            const agenteId = agente?.idAgente || agente;
            this.ticketForm.get('idAgente').setValue(agenteId);
        });

        this.ticket = this.ticketForm.value as Ticket;
        return this.ticketForm;
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

    private async getTicketByCodigo(idTicket: number) {
        const formData = new FormData();
        formData.append('idTicket', idTicket.toString());
        try {
            const response = await lastValueFrom(
                this.postData(formData, 'op=uno')
            );
            this.formTicket(response);
            // const agenteSeleccionado = this.agentes.find((agente) => agente.idAgente == response.idAgente)
            // if (agenteSeleccionado)
            //   this.ticketForm.get('agente').setValue(agenteSeleccionado);
        } catch (error) {
            console.error('Error al obtener datos del Ticket', error);
        }
    }

    public async confirmCreateOrUpdateTicket(operation: string) {
        this.loading = true;
        if (this.ticketForm.valid) {
            let idEstadoTicket = this.ticketForm.get('idEstadoTicket').value;
            // console.log('aqui ' + idEstadoTicket);
            const fechaActual = new Date()
                .toLocaleString('sv-SE', { timeZone: 'America/Guayaquil' })
                .replace('T', ' ');
            if (operation === 'op=actualizar' && idEstadoTicket === '1') {
                // console.log('ingreso');
                this.ticketForm.get('idEstadoTicket').setValue(2);
                this.ticketForm
                    .get('fechaPrimeraRespuesta')
                    .setValue(fechaActual);
            }
            this.ticketForm.get('fechaAtualizacion').setValue(fechaActual);
            const formData = this.createFormData(this.ticketForm.value);
            try {
                await lastValueFrom(this.postData(formData, operation));
                if (this.validarRol.usuario()) {
                    this.router.navigate(['/ticket/ticket-list']);
                }
                setTimeout(() => {
                    this.showToast(
                        'success',
                        'Éxito',
                        'La operación se realizó correctamente.'
                    );
                }, 200);
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

    public showToast(
        severity: 'success' | 'error',
        summary: string,
        detail: string
    ) {
        this.messageService.add({ severity, summary, detail });
    }
    private async formTicketDetalle(): Promise<FormGroup> {
        this.ticketDetalle = new TicketDetalle();
        this.bloquearEdicion = this.isEdicion;

        return new Promise((resolve, reject) => {
            this.activatedRoute.params.subscribe(async (params) => {
                this.idTicket = params['codigo'];
                const formData = new FormData();
                formData.append('idTicket', this.idTicket.toString());
                try {
                    this.ticketDetalleForm = this.fb.group({
                        idTicketDetalle: [],
                        idTicket: [this.idTicket],
                        idAgente: [
                            this.validarRol.usuario()
                                ? null
                                : this.ticketForm.get('idAgente').value,
                        ],
                        idDepartamentoA: [
                            this.ticketForm.get('idDepartamentoA').value,
                        ],
                        observacion: [],
                        detalle: [, Validators.required],
                        fechaDetalle: [],
                        tipoDetalle: [this.tipoDetalle],
                    });
                    this.ticketDetalle = this.ticketDetalleForm
                        .value as TicketDetalle;
                    resolve(this.ticketDetalleForm);
                } catch (error) {
                    console.error('Error en formTicketDetalle', error);
                    reject(error);
                }
            });
        });
    }
    async enviarMensaje() {
        this.loading = true;
        if (this.ticketDetalleForm.valid) {
            const formData = this.createFormData(this.ticketDetalleForm.value);
            console.log(this.ticketDetalleForm);
            console.log(formData);

            try {
                await lastValueFrom(
                    this.postTicketDetalleData(formData, 'op=insertar')
                );
                this.showToast(
                    'success',
                    'Éxito',
                    'La operación se realizó correctamente.'
                );
                setTimeout(() => {
                    location.reload();
                }, 400);
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
