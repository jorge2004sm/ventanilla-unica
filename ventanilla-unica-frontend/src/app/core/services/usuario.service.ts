import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);

  obtenerPorTenant(tenantId: number, limit?: number, offset?: number): Observable<Usuario[]> {
    let params = new HttpParams();
    if (limit) params = params.set('limit', limit);
    if (offset) params = params.set('offset', offset);
    return this.http.get<Usuario[]>(`${environment.apiUrl}/usuarios/tenant/${tenantId}`, { params });
  }

  obtenerPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${environment.apiUrl}/usuarios/${id}`);
  }

  crear(datos: {
    nombre: string;
    apellidos: string;
    email: string;
    password: string;
    dni?: string;
    telefono?: string;
    rol_id: number;
    tenant_id?: number;
    mesa_id?: number;
  }): Observable<Usuario> {
    return this.http.post<Usuario>(`${environment.apiUrl}/usuarios`, datos);
  }

  actualizar(id: number, datos: Partial<{
    nombre: string;
    apellidos: string;
    email: string;
    password: string;
    dni: string;
    telefono: string;
    activo: boolean;
    rol_id: number;
    tenant_id: number;
    mesa_id: number;
  }>): Observable<Usuario> {
    return this.http.patch<Usuario>(`${environment.apiUrl}/usuarios/${id}`, datos);
  }

  desactivar(id: number): Observable<Usuario> {
    return this.http.delete<Usuario>(`${environment.apiUrl}/usuarios/${id}`);
  }

  obtenerTodos(limit?: number, offset?: number): Observable<Usuario[]> {
    let params = new HttpParams();
    if (limit) params = params.set('limit', limit);
    if (offset) params = params.set('offset', offset);
    return this.http.get<Usuario[]>(`${environment.apiUrl}/usuarios`, { params });
}
}