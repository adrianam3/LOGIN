import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-base-conocimiento-list',
  templateUrl: './base-conocimiento-list.component.html',
  styleUrls: ['./base-conocimiento-list.component.scss']
})
export class BaseConocimientoListComponent implements OnInit {
  baseDeConocimiento: any[] = [];
  buscar: string = '';
  categoriaSeleccionada: string = '';
  categoriaOpciones: any[] = [];
  private baseConocimientosApi = `${environment.apiUrl}/controllers/categoriasbaseconocimientos.controller.php?op=todos`;
  public baseConocimientosAll: any = [];

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getFormatoBaseConocimientos();
  }

  getFormatoBaseConocimientos(): void {
    this.http.get<any[]>(this.baseConocimientosApi).subscribe(data => {
      const categoriasMap = {};
      data.forEach(item => {
        if (categoriasMap[item.idCategoria]) {
          if (item.BaseConocimientosTitulo && item.BaseConocimientosContenido) {
            categoriasMap[item.idCategoria].guias.push({
              titulo: item.BaseConocimientosTitulo,
              contenido: item.BaseConocimientosContenido,
              expandir: false
            });
          }
        } else {
          categoriasMap[item.idCategoria] = {
            nombre: item.nombreCategoria,
            guias: []
          };
          if (item.BaseConocimientosTitulo && item.BaseConocimientosContenido) {
            categoriasMap[item.idCategoria].guias.push({
              titulo: item.BaseConocimientosTitulo,
              contenido: item.BaseConocimientosContenido,
              expandir: false
            });
          }

        }
      });
      this.baseDeConocimiento = Object.values(categoriasMap);
      this.categoriaOpciones = this.baseDeConocimiento.map(categoria => ({
        label: categoria.nombre,
        value: categoria.nombre,
      }));
    });
  }
  getBaseConocimientos(): Observable<any[]> {
    return this.http.get<any[]>(this.baseConocimientosApi);
  }
  alternarGuia(guia: any): void {
    guia.expandir = !guia.expandir;
  }
  filtrarCategorias() {
    if (!this.categoriaSeleccionada) {
      return this.baseDeConocimiento;
    }
    return this.baseDeConocimiento.filter(categoria => categoria.nombre === this.categoriaSeleccionada);
  }
  filtrarGuias(guias: any[]) {
    if (!this.buscar) {
      return guias;
    }
    return guias.filter(guia =>
      guia.titulo.toLowerCase().includes(this.buscar.toLowerCase())
    );
  }
}
