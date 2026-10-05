import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';
import { AuthService } from '../../../core/services/auth.service';
import { Cita, EstadoCita } from '../../../core/models';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-empleado-dashboard',
  standalone: true,
  imports: [RouterLink, SlicePipe],
  templateUrl: './dashboard.component.html',
})
export class EmpleadoDashboardComponent {
  private readonly citaService = inject(CitaService);
  readonly auth = inject(AuthService);

  readonly citas = signal<Cita[]>([]);
  readonly loading = signal(true);
  readonly fechaFiltro = signal(this.hoy());

  readonly metricas = computed(() => {
    const todas = this.citas();
    const pendientes = todas.filter((c) => c.estado === EstadoCita.PENDIENTE);
    const completadas = todas.filter((c) => c.estado === EstadoCita.COMPLETADA);

    const ahora = new Date();
    const horaActual = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
    const proxima = pendientes.find((c) => c.hora_inicio >= horaActual);

    return {
      total: todas.length,
      pendientes: pendientes.length,
      completadas: completadas.length,
      proxima: proxima?.hora_inicio?.slice(0, 5) ?? '-',
    };
  });

  constructor() {
    this.cargarCitas(this.fechaFiltro());
  }

  cambiarFecha(fecha: string): void {
    this.fechaFiltro.set(fecha);
    this.cargarCitas(fecha);
  }

  private cargarCitas(fecha: string): void {
    this.loading.set(true);
    this.citaService.obtenerMisCitasEmpleado(fecha).subscribe({
      next: (citas) => {
        this.citas.set(citas);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  badgeClass(estado: string): string {
    switch (estado) {
      case EstadoCita.PENDIENTE: return 'bg-yellow-100 text-yellow-800';
      case EstadoCita.COMPLETADA: return 'bg-green-100 text-green-800';
      case EstadoCita.CANCELADA: return 'bg-red-100 text-red-800';
      case EstadoCita.NO_PRESENTADO_CIUDADANO: return 'bg-gray-100 text-gray-800';
      case EstadoCita.NO_PRESENTADO_EMPLEADO: return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  estadoLabel(estado: string): string {
    switch (estado) {
      case EstadoCita.PENDIENTE: return 'Pendiente';
      case EstadoCita.COMPLETADA: return 'Completada';
      case EstadoCita.CANCELADA: return 'Cancelada';
      case EstadoCita.NO_PRESENTADO_CIUDADANO: return 'No presentado';
      case EstadoCita.NO_PRESENTADO_EMPLEADO: return 'No presentado (empleado)';
      default: return estado;
    }
  }

  private hoy(): string {
    return new Date().toISOString().split('T')[0];
  }
}