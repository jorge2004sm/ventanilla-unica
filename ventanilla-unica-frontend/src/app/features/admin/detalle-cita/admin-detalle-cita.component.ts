import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CitaService } from '../../../core/services/cita.service';
import { TramiteService } from '../../../core/services/tramite.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { Cita, EstadoCita, Tramite, Documento, Usuario } from '../../../core/models';
import { environment } from '../../../../environments/environment';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-admin-detalle-cita',
  standalone: true,
  imports: [RouterLink, FormsModule, SlicePipe],
  templateUrl: './admin-detalle-cita.component.html',
})
export class AdminDetalleCitaComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly citaService = inject(CitaService);
  private readonly tramiteService = inject(TramiteService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly auth = inject(AuthService);

  readonly cita = signal<Cita | null>(null);
  readonly tramite = signal<Tramite | null>(null);
  readonly documentos = signal<Documento[]>([]);
  readonly empleados = signal<Usuario[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly subiendoDoc = signal(false);
  readonly successMsg = signal<string | null>(null);
  readonly errorMsg = signal<string | null>(null);
  readonly apiUrl = environment.apiUrl;

  nuevoEstado = '';
  observaciones = '';
  empleadoReasignar = 0;

  archivoSeleccionado: File | null = null;
  readonly mostrarFormDoc = signal(false);

  readonly estadosDisponibles = [
    { valor: EstadoCita.PENDIENTE, label: 'Pendiente' },
    { valor: EstadoCita.COMPLETADA, label: 'Completada' },
    { valor: EstadoCita.NO_PRESENTADO_CIUDADANO, label: 'No presentado (ciudadano)' },
    { valor: EstadoCita.NO_PRESENTADO_EMPLEADO, label: 'No presentado (empleado)' },
    { valor: EstadoCita.CANCELADA, label: 'Cancelada' },
  ];

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarCita(id);
    this.cargarEmpleados();
  }

  private cargarCita(id: number): void {
    this.citaService.obtenerPorId(id).subscribe({
      next: (cita) => {
        this.cita.set(cita);
        this.nuevoEstado = cita.estado;
        this.observaciones = cita.observaciones ?? '';
        this.empleadoReasignar = cita.empleado.id;
        this.loading.set(false);

        this.tramiteService.obtenerPorCita(cita.id).subscribe({
          next: (tramite) => {
            this.tramite.set(tramite);
            if (tramite) this.cargarDocumentos(tramite.id);
          },
        });
      },
      error: () => {
        this.loading.set(false);
        this.errorMsg.set('No se pudo cargar la cita.');
      },
    });
  }

  private cargarEmpleados(): void {
    const tenantId = this.auth.getTenantId();
    if (tenantId) {
      this.usuarioService.obtenerPorTenant(tenantId).subscribe({
        next: (u) => this.empleados.set(u.filter((e) => e.rol.nombre === 'empleado' && e.activo)),
      });
    }
  }

  private cargarDocumentos(tramiteId: number): void {
    this.tramiteService.obtenerDocumentos(tramiteId).subscribe({
      next: (docs) => this.documentos.set(docs),
    });
  }

  guardar(): void {
    const cita = this.cita();
    if (!cita) return;

    this.saving.set(true);
    this.successMsg.set(null);
    this.errorMsg.set(null);

    const datos: { estado?: string; observaciones?: string } = {};

    if (this.nuevoEstado !== cita.estado) {
      datos.estado = this.nuevoEstado;
    }
    if (this.observaciones !== (cita.observaciones ?? '')) {
      datos.observaciones = this.observaciones;
    }

    if (Object.keys(datos).length === 0) {
      this.saving.set(false);
      this.errorMsg.set('No hay cambios que guardar.');
      return;
    }

    this.citaService.actualizarEstado(cita.id, datos).subscribe({
      next: (citaActualizada) => {
        this.cita.set(citaActualizada);
        this.saving.set(false);
        this.successMsg.set('Cita actualizada.');
        setTimeout(() => this.successMsg.set(null), 3000);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMsg.set(err.error?.message ?? 'Error al actualizar.');
      },
    });
  }

  reasignar(): void {
    const cita = this.cita();
    if (!cita || !this.empleadoReasignar || this.empleadoReasignar === cita.empleado.id) return;

    this.saving.set(true);
    this.errorMsg.set(null);

    this.citaService.reasignar(cita.id, Number(this.empleadoReasignar)).subscribe({
      next: (citaActualizada) => {
        this.cita.set(citaActualizada);
        this.saving.set(false);
        this.successMsg.set('Cita reasignada.');
        setTimeout(() => this.successMsg.set(null), 3000);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMsg.set(err.error?.message ?? 'Error al reasignar.');
      },
    });
  }

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoSeleccionado = input.files[0];
    }
  }

  subirDocumento(): void {
    const tramite = this.tramite();
    if (!tramite || !this.archivoSeleccionado) {
      this.errorMsg.set('Selecciona un archivo.');
      return;
    }

    this.subiendoDoc.set(true);
    this.errorMsg.set(null);

    this.tramiteService.subirDocumento(tramite.id, this.archivoSeleccionado).subscribe({
      next: (doc) => {
        this.documentos.update((list) => [...list, doc]);
        this.subiendoDoc.set(false);
        this.archivoSeleccionado = null;
        this.mostrarFormDoc.set(false);
        this.successMsg.set('Documento subido.');
        setTimeout(() => this.successMsg.set(null), 3000);
      },
      error: (err) => {
        this.subiendoDoc.set(false);
        this.errorMsg.set(err.error?.message ?? 'Error al subir documento.');
      },
    });
  }

  badgeClass(estado: string): string {
    const map: Record<string, string> = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      completada: 'bg-green-100 text-green-800',
      cancelada: 'bg-red-100 text-red-800',
      no_presentado_ciudadano: 'bg-gray-100 text-gray-800',
      no_presentado_empleado: 'bg-orange-100 text-orange-800',
    };
    return map[estado] ?? 'bg-gray-100 text-gray-800';
  }

  estadoLabel(estado: string): string {
    const map: Record<string, string> = {
      pendiente: 'Pendiente',
      completada: 'Completada',
      cancelada: 'Cancelada',
      no_presentado_ciudadano: 'No presentado',
      no_presentado_empleado: 'No presentado (empleado)',
    };
    return map[estado] ?? estado;
  }
}