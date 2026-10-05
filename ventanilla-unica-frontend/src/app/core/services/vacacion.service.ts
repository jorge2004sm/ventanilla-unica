import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cita, Vacacion } from '../models';

@Injectable({ providedIn: 'root' })
export class VacacionService {
  private readonly http = inject(HttpClient);

  solicitar(datos: {
    fecha_inicio: string;
    fecha_fin: string;
    tipo: string;
    motivo?: string;
    usuario_id: number;
  }): Observable<Vacacion> {
    return this.http.post<Vacacion>(`${environment.apiUrl}/vacaciones`, datos);
  }

  obtenerMisVacaciones(limit?: number, offset?: number): Observable<Vacacion[]> {
    let params = new HttpParams();
    if (limit) params = params.set('limit', limit);
    if (offset) params = params.set('offset', offset);
    return this.http.get<Vacacion[]>(`${environment.apiUrl}/vacaciones/mis-vacaciones`, { params });
  }

  obtenerPendientes(limit?: number, offset?: number): Observable<Vacacion[]> {
    let params = new HttpParams();
    if (limit) params = params.set('limit', limit);
    if (offset) params = params.set('offset', offset);
    return this.http.get<Vacacion[]>(`${environment.apiUrl}/vacaciones/pendientes`, { params });
  }

  aprobar(id: number): Observable<Vacacion> {
    return this.http.patch<Vacacion>(`${environment.apiUrl}/vacaciones/${id}/aprobar`, {});
  }

  rechazar(id: number): Observable<Vacacion> {
    return this.http.patch<Vacacion>(`${environment.apiUrl}/vacaciones/${id}/rechazar`, {});
  }

  obtenerCitasAfectadas(vacacionId: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${environment.apiUrl}/vacaciones/${vacacionId}/citas-afectadas`);
  }
}