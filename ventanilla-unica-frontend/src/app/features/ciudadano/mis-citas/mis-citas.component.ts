import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';
import { Cita, EstadoCita } from '../../../core/models';
import { DatePipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [RouterLink, SlicePipe, DatePipe],
  templateUrl: './mis-citas.component.html',
})
export class MisCitasComponent {
  private readonly citaService = inject(CitaService);

  readonly citas = signal<Cita[]>([]);
  readonly loading = signal(true);
  readonly filtroEstado = signal<string>('todos');

  readonly estados = [
    { valor: 'todos', label: 'Todas' },
    { valor: EstadoCita.PENDIENTE, label: 'Pendientes' },
    { valor: EstadoCita.COMPLETADA, label: 'Completadas' },
    { valor: EstadoCita.CANCELADA, label: 'Canceladas' },
    { valor: EstadoCita.NO_PRESENTADO_CIUDADANO, label: 'No presentado (ciudadano)' },
    { valor: EstadoCita.NO_PRESENTADO_EMPLEADO, label: 'No presentado (empleado)' },
  ];

  readonly citasFiltradas = computed(() => {
    const filtro = this.filtroEstado();
    const todas = this.citas();
    if (filtro === 'todos') return todas;
    return todas.filter((c) => c.estado === filtro);
  });

  constructor() {
    this.cargarCitas();
  }

  private cargarCitas(): void {
    this.citaService.obtenerMisCitas().subscribe({
      next: (citas) => {
        this.citas.set(citas);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  filtrar(estado: string): void {
    this.filtroEstado.set(estado);
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
}