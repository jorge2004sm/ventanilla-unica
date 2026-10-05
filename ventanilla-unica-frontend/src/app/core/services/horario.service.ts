import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Horario } from '../models';

@Injectable({ providedIn: 'root' })
export class HorarioService {
  private readonly http = inject(HttpClient);

  obtenerBasePorTenant(tenantId: number): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${environment.apiUrl}/horarios/tenant/${tenantId}/base`);
  }

  obtenerEspecialesPorTenant(tenantId: number): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${environment.apiUrl}/horarios/tenant/${tenantId}/especiales`);
  }

  crear(datos: any): Observable<Horario> {
    return this.http.post<Horario>(`${environment.apiUrl}/horarios`, datos);
  }
  actualizar(id: number, datos: any): Observable<Horario> {
    return this.http.patch<Horario>(`${environment.apiUrl}/horarios/${id}`, datos);
  }
  desactivar(id: number): Observable<Horario> {
    return this.http.patch<Horario>(`${environment.apiUrl}/horarios/${id}`, { activo: false });
  }
}