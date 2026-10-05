import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tenant } from '../models';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private readonly http = inject(HttpClient);

  obtenerTodos(limit?: number, offset?: number): Observable<Tenant[]> {
    let params = new HttpParams();
    if (limit) params = params.set('limit', limit);
    if (offset) params = params.set('offset', offset);
    return this.http.get<Tenant[]>(`${environment.apiUrl}/tenants`, { params });
  }

  obtenerPorId(id: number): Observable<Tenant> {
    return this.http.get<Tenant>(`${environment.apiUrl}/tenants/${id}`);
  }

  crear(datos: { nombre: string; direccion?: string; telefono?: string; email?: string }): Observable<Tenant> {
    return this.http.post<Tenant>(`${environment.apiUrl}/tenants`, datos);
  }

  actualizar(id: number, datos: Partial<{ nombre: string; direccion: string; telefono: string; email: string; activo: boolean }>): Observable<Tenant> {
    return this.http.patch<Tenant>(`${environment.apiUrl}/tenants/${id}`, datos);
  }

  desactivar(id: number): Observable<Tenant> {
    return this.http.delete<Tenant>(`${environment.apiUrl}/tenants/${id}`);
  }
}