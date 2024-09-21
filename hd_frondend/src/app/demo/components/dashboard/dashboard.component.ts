import { Component, OnInit } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    public dashboardAll: any = [];
    private DashboardApi = `${environment.apiUrl}/controllers/ticket.controller.php?op=dashboard`;

    public fechaInicio: string = '';
    public fechaFin: string = '';
    data: any;
    options: any;

    constructor(
        public layoutService: LayoutService,
        private http: HttpClient,
    ) { }

    ngOnInit() {
        const today = new Date();
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - 30);
        this.fechaFin = today.toISOString().split('T')[0];
        this.fechaInicio = pastDate.toISOString().split('T')[0];

        this.loadDashboard();
        this.data = {
            labels: [],
            datasets: [
                {
                    data: [],
                    backgroundColor: [],
                    hoverBackgroundColor: []
                }
            ]
        };
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        this.options = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
    }
    getDashboard(fechaInicio: string, fechaFin: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.DashboardApi}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
    }
    private async loadDashboard(): Promise<void> {
        try {
            const data = await lastValueFrom(this.getDashboard(this.fechaInicio, this.fechaFin));
            this.dashboardAll = data.map((r) => ({
                nombre: r.nombre,
                count: r['COUNT(*)']
            }));
            const backgroundColors = this.generateRandomColors(this.dashboardAll.length);
            const hoverBackgroundColors = this.generateHoverColors(backgroundColors);

            this.data = {
                labels: this.dashboardAll.map(r => r.nombre),
                datasets: [
                    {
                        data: this.dashboardAll.map(r => r.count),
                        backgroundColor: backgroundColors,
                        hoverBackgroundColor: hoverBackgroundColors
                    }
                ]
            };
        } catch (error) {
            console.error('Error al cargar dashboard', error);
        }
    }

    private generateRandomColors(length: number): string[] {
        const colors: string[] = [];
        for (let i = 0; i < length; i++) {
            const color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
            colors.push(color);
        }
        return colors;
    }

    private generateHoverColors(colors: string[]): string[] {
        return colors.map(color => {
            return color.replace('60%', '50%');
        });
    }

    public onSubmit(): void {
        if (this.fechaInicio && this.fechaFin) {
            this.loadDashboard();
        } else {
            console.error('Por favor, ingrese ambas fechas.');
        }
    }
}
