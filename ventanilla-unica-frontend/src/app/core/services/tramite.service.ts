import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tramite, Documento } from '../models';

@Injectable({ providedIn: 'root' })
export class TramiteService {
  private readonly http = inject(HttpClient);

  obtenerPorCita(citaId: number): Observable<Tramite> {
    return this.http.get<Tramite>(`${environment.apiUrl}/tramites/cita/${citaId}`);
  }

  actualizarEstado(id: number, datos: { estado?: string; observaciones?: string }): Observable<Tramite> {
    return this.http.patch<Tramite>(`${environment.apiUrl}/tramites/${id}`, datos);
  }

  obtenerDocumentos(tramiteId: number): Observable<Documento[]> {
    return this.http.get<Documento[]>(`${environment.apiUrl}/tramites/${tramiteId}/documentos`);
  }

  subirDocumento(tramiteId: number, archivo: File): Observable<Documento> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.http.post<Documento>(`${environment.apiUrl}/tramites/${tramiteId}/documentos`, formData);
  }
}