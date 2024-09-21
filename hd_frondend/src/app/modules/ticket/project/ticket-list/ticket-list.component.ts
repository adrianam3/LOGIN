import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs'; // Importar lastValueFrom
import { environment } from 'src/environments/environment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ValidarRolesService } from 'src/app/modules/core/validar-roles.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss'
})
export class TicketListComponent {
  public tickets: any;
  public showSearch: boolean;
  public ticketsAll: any = [];
  private ticketApi = `${environment.apiUrl}/controllers/ticket.controller.php?op=todos`;
  public idUsuario: string;
  public idRol: string;
  public filteredTickets: any = [];

  displayModal: boolean = false;
  ticketForm: FormGroup;
  public agentes: any = [];
  public departamentoAgentes: any = [];
  public nombreCompleto: string;
  public loading: boolean = false;

  constructor(
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    public validarRol: ValidarRolesService,
    private fb: FormBuilder,

  ) {
  }

  ngOnInit(): void {
    this.idUsuario = localStorage.getItem('idUsuario');
    this.loadTickets(); // Llamar al método que carga los datos
    this.ticketForm = this.fb.group({
      idTicket: [],
      idDepartamentoA: [],
      idAgente: [],
      departamentoAgente: [,
        (this.validarRol.administrador() || this.validarRol.agente() || this.validarRol.coordinador())
          ? Validators.required
          : null
      ],
      agente: [,
        (this.validarRol.administrador() || this.validarRol.agente() || this.validarRol.coordinador())
          ? Validators.required
          : null
      ]
    });
  }

  postData(data: any, operation: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/controllers/ticket.controller.php?${operation}`, data);
  }

  getTickets(): Observable<any[]> {
    return this.http.get<any[]>(this.ticketApi);
  }

  private departamentoAgenteApi = `${environment.apiUrl}/controllers/departamentoagente.controller.php?op=todos`;
  getDepartamentoAgente(): Observable<any[]> {
    return this.http.get<any[]>(this.departamentoAgenteApi);
  }
  private agenteApi = `${environment.apiUrl}/controllers/agente.controller.php?op=todosByDepartamento`;
  getAgentes(idDepartamentoA): Observable<any[]> {
    return this.http.get<any[]>(`${this.agenteApi}&idDepartamentoA=${idDepartamentoA}`);
  }

  private async loadTickets(): Promise<void> {
    try {
      const data = await lastValueFrom(this.getTickets());
      if (data && Array.isArray(data)) {
        this.ticketsAll = data.map((u) => ({
          idTicket: u.idTicket,
          idDepartamentoA: u.idDepartamentoA,
          idAgente: u.idAgente,
          titulo: u.titulo,
          descEstadoTicket: u.estadoTicketNombre || 'No proporcionado',
          fechaCreacion: u.fechaCreacion,
          fechaAtualizacion: u.fechaAtualizacion,
          descPersona: `${u.personaNombres} ${u.personaApellidos}`,
          descPrioridad: u.prioridadNombre,
          descDepartamentoA: u.departamentoANombre,
          descAgente: u.agenteNombreCompleto,
          resueltoPrimerContacto: u.resueltoPrimerContacto,
        }));

        this.filteredTickets = this.ticketsAll.filter(ticket => ticket.descEstadoTicket !== 'Cerrado');
      } else {
        console.warn('No se recibieron tickets o los datos no son válidos');
        this.ticketsAll = [];
        this.filteredTickets = [];
      }
    } catch (error) {
      console.error('Error al cargar tickets', error);
    }
  }


  public filterTickets(filterType: string): void {
    if (filterType === 'closed') {
      this.filteredTickets = this.ticketsAll.filter(ticket => ticket.descEstadoTicket === 'Cerrado');
    } else {
      this.filteredTickets = this.ticketsAll.filter(ticket => ticket.descEstadoTicket !== 'Cerrado');
    }
  }


  public showFilter() {
    this.showSearch = !this.showSearch;
  }

  public confirmEliminar(rowData): void {
    this.confirmationService.confirm({
      key: 'ticket',
      header: 'Eliminar Ticket',
      message: `¿Estás seguro de que deseas eliminar el Tikc ${rowData.idTicket}?`,
      accept: () => {
        this.eliminarTicket(rowData.idTicket);
      }
    });
  }
  private async eliminarTicket(idTicket: string): Promise<void> {
    const formData = new FormData();
    formData.append("idTicket", idTicket);
    try {
      const response = await lastValueFrom(this.postData(formData, 'op=eliminar'));
      if (response) {
        await this.loadTickets(); // Recargar la tabla
        this.showToast('success', 'Éxito', 'Ticket eliminado correctamente.');
      }
    } catch (error) {
      console.error('Error al eliminar el ticket', error);
      this.showToast('error', 'Error', error.error);
    }
  }
  public showToast(severity: 'success' | 'error', summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail });
  }
  async seleccionarDepartamento(event) {
    const departamentoAId = event.value.idDepartamentoA;
    const agentes = await lastValueFrom(this.getAgentes(departamentoAId));
    this.agentes = agentes;
  }
  async asignarAgente(rowData, idTicket: number, idDepartamentoA: number, idAgente: number, titulo: number) {
    this.displayModal = true;
    this.agentes = await lastValueFrom(this.getAgentes(idDepartamentoA));
    this.departamentoAgentes = await lastValueFrom(this.getDepartamentoAgente());
    this.nombreCompleto = `${localStorage.getItem('nombres')} ${localStorage.getItem('apellidos')}`;
    this.ticketForm = this.fb.group({
      idTicket: [idTicket],
      nombreUsuario: [this.nombreCompleto],
      idDepartamentoA: [idDepartamentoA],
      idAgente: [idAgente],
      titulo: [titulo],
      departamentoAgente: [idDepartamentoA,
        (this.validarRol.administrador() || this.validarRol.agente() || this.validarRol.coordinador())
          ? Validators.required
          : null
      ],
      agente: [idAgente,
        (this.validarRol.administrador() || this.validarRol.agente() || this.validarRol.coordinador())
          ? Validators.required
          : null
      ]
    });
    this.ticketForm.get('departamentoAgente').valueChanges.subscribe((departamentoAgente) => {
      const departamentoAgenteId = departamentoAgente?.idDepartamentoA || departamentoAgente;
      this.ticketForm.get('idDepartamentoA').setValue(departamentoAgenteId);
    });
    if (this.ticketForm && this.ticketForm.get('idDepartamentoA')) {
      const departamentoAgenteSeleccionado = this.departamentoAgentes.find((departamentoAgente) => departamentoAgente.idDepartamentoA == idDepartamentoA)
      this.ticketForm.get('departamentoAgente').setValue(departamentoAgenteSeleccionado);
    }
    if (idDepartamentoA) {
      this.getAgentes(idDepartamentoA).subscribe((agentes) => {
        this.agentes = agentes;
        const agenteSeleccionado = this.agentes.find((agente) => agente.idAgente == idAgente);
        this.ticketForm.get('agente').setValue(agenteSeleccionado);
      });
    }
    if (this.ticketForm && this.ticketForm.get('idAgente')) {
      this.ticketForm.get('agente').valueChanges.subscribe((agente) => {
        const agenteId = agente?.idAgente || agente;
        this.ticketForm.get('idAgente').setValue(agenteId);
      });
    }
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
  async confirmarAsignarAgente(operation: string) {
    this.loading = true;
    if (this.ticketForm.valid) {
      const formData = this.createFormData(this.ticketForm.value);
      try {
        await lastValueFrom(this.postData(formData, operation));
        location.reload();
        setTimeout(() => {
          this.showToast('success', 'Éxito', 'La operación se realizó correctamente.');
        }, 200);
      } catch (error) {
        console.error('Error:', error);
        this.showToast('error', 'Error', 'Ocurrió un error al realizar la operación.');
    } finally {
        this.loading = false;
    }
    } else {
        this.loading = false;
      this.showToast('error', 'Error', 'Complete los campos obligatorios para guardar.');
    }
    this.displayModal = false;
  }
}
