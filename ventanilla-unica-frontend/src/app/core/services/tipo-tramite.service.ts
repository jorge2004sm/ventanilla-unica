import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TipoTramite } from '../models';

@Injectable({ providedIn: 'root' })
export class TipoTramiteService {
  private readonly http = inject(HttpClient);

  obtenerTodos(): Observable<TipoTramite[]> {
    return this.http.get<TipoTramite[]>(`${environment.apiUrl}/tipos-tramite`);
  }

  obtenerPorTenant(tenantId: number): Observable<TipoTramite[]> {
    return this.http.get<TipoTramite[]>(`${environment.apiUrl}/tipos-tramite/tenant/${tenantId}`);
  }

  obtenerPorId(id: number): Observable<TipoTramite> {
    return this.http.get<TipoTramite>(`${environment.apiUrl}/tipos-tramite/${id}`);
  }
  crear(datos: { nombre: string; descripcion?: string; requisitos_documentos?: string; tenant_id: number }): Observable<TipoTramite> {
    return this.http.post<TipoTramite>(`${environment.apiUrl}/tipos-tramite`, datos);
  }
  actualizar(id: number, datos: Partial<{ nombre: string; descripcion: string; requisitos_documentos: string; activo: boolean }>): Observable<TipoTramite> {
    return this.http.patch<TipoTramite>(`${environment.apiUrl}/tipos-tramite/${id}`, datos);
  }
}