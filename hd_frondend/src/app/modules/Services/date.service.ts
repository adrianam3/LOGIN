import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  constructor() { }

  obtenerZonaHoraria(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  obtenerFechaActual(): string {
    const zonaHoraria = this.obtenerZonaHoraria();
    return new Date().toLocaleString('es-ES', { timeZone: zonaHoraria });
  }

  obtenerFechaActualFormateada(): string {
    const zonaHoraria = this.obtenerZonaHoraria();
    return new Intl.DateTimeFormat('es-ES', {
      timeZone: zonaHoraria,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date());
  }
}
