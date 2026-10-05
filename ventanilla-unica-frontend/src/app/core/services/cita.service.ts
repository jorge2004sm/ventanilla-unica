import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cita } from '../models';

@Injectable({ providedIn: 'root' })
export class CitaService {
    private readonly http = inject(HttpClient);

    crear(datos: {
        ciudadano_nombre: string;
        ciudadano_apellidos: string;
        ciudadano_email: string;
        ciudadano_dni: string;
        ciudadano_telefono: string;
        fecha: string;
        hora_inicio: string;
        hora_fin: string;
        tenant_id: number;
        tipo_tramite_id: number;
        ciudadano_id?: number;
    }): Observable<Cita> {
        return this.http.post<Cita>(`${environment.apiUrl}/citas`, datos);
    }

    obtenerMisCitas(limit?: number, offset?: number): Observable<Cita[]> {
        let params = new HttpParams();
        if (limit) params = params.set('limit', limit);
        if (offset) params = params.set('offset', offset);
        return this.http.get<Cita[]>(`${environment.apiUrl}/citas/ciudadano`, { params });
    }

    obtenerMisCitasEmpleado(fecha?: string, limit?: number, offset?: number): Observable<Cita[]> {
        let params = new HttpParams();
        if (fecha) params = params.set('fecha', fecha);
        if (limit) params = params.set('limit', limit);
        if (offset) params = params.set('offset', offset);
        return this.http.get<Cita[]>(`${environment.apiUrl}/citas/mis-citas`, { params });
    }

    obtenerPorId(id: number): Observable<Cita> {
        return this.http.get<Cita>(`${environment.apiUrl}/citas/${id}`);
    }

    actualizarEstado(id: number, datos: { estado?: string; observaciones?: string }): Observable<Cita> {
        return this.http.patch<Cita>(`${environment.apiUrl}/citas/${id}`, datos);
    }

    obtenerHorasOcupadas(tenantId: number, fecha: string): Observable<string[]> {
        return this.http.get<string[]>(`${environment.apiUrl}/citas/disponibilidad/${tenantId}/${fecha}`);
    }

    obtenerPorTenant(tenantId: number, limit?: number, offset?: number): Observable<Cita[]> {
        let params = new HttpParams();
        if (limit) params = params.set('limit', limit);
        if (offset) params = params.set('offset', offset);
        return this.http.get<Cita[]>(`${environment.apiUrl}/citas/tenant/${tenantId}`, { params });
    }

    reasignar(citaId: number, empleadoId: number): Observable<Cita> {
        return this.http.patch<Cita>(`${environment.apiUrl}/citas/${citaId}/reasignar`, { empleado_id: empleadoId });
    }
}