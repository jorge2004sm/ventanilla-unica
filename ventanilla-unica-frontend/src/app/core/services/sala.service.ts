import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Sala, Mesa } from '../models';

@Injectable({ providedIn: 'root' })
export class SalaService {
  private readonly http = inject(HttpClient);

  obtenerPorTenant(tenantId: number, limit?: number, offset?: number): Observable<Sala[]> {
    let params = new HttpParams();
    if (limit) params = params.set('limit', limit);
    if (offset) params = params.set('offset', offset);
    return this.http.get<Sala[]>(`${environment.apiUrl}/salas/tenant/${tenantId}`, { params });
  }

  crear(datos: { nombre: string; descripcion?: string; tenant_id: number }): Observable<Sala> {
    return this.http.post<Sala>(`${environment.apiUrl}/salas`, datos);
  }

  actualizar(id: number, datos: Partial<{ nombre: string; descripcion: string; activa: boolean }>): Observable<Sala> {
    return this.http.patch<Sala>(`${environment.apiUrl}/salas/${id}`, datos);
  }

  obtenerMesasPorSala(salaId: number): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(`${environment.apiUrl}/mesas/sala/${salaId}`);
  }

  crearMesa(datos: { numero: number; sala_id: number }): Observable<Mesa> {
    return this.http.post<Mesa>(`${environment.apiUrl}/mesas`, datos);
  }

  actualizarMesa(id: number, datos: Partial<{ numero: number; activa: boolean }>): Observable<Mesa> {
    return this.http.patch<Mesa>(`${environment.apiUrl}/mesas/${id}`, datos);
  }
}