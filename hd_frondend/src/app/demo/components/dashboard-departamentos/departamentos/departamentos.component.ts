import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.scss']
})
export class DepartamentosComponent {
    public dashboardAll: any = [];
    private DashboardApi = `${environment.apiUrl}/controllers/ticket.controller.php?op=dashboarddepartamentoestado`;
    public fechaInicio: string;
    public fechaFin: string;

    constructor(
        public layoutService: LayoutService,
        private http: HttpClient,
    ) { }

    ngOnInit() {
        this.setDefaultDates();
        this.loadDashboard();
    }

    setDefaultDates() {
        const today = new Date();
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - 30);
        this.fechaFin = today.toISOString().split('T')[0];
        this.fechaInicio = pastDate.toISOString().split('T')[0];
    }

    getDashboard(fechaInicio: string, fechaFin: string) {
        return this.http.get<any[]>(`${this.DashboardApi}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
    }

    async loadDashboard() {
        try {
            const data = await lastValueFrom(this.getDashboard(this.fechaInicio, this.fechaFin));
            this.dashboardAll = data;
        } catch (error) {
            console.error('Error al cargar el dashboard', error);
        }
    }

    onSubmit() {
        if (this.fechaInicio && this.fechaFin) {
            this.loadDashboard();
        } else {
            console.error('Por favor, ingrese ambas fechas.');
        }
    }
}
