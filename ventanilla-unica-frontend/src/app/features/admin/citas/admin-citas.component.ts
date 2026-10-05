import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CitaService } from '../../../core/services/cita.service';
import { AuthService } from '../../../core/services/auth.service';
import { Cita, EstadoCita } from '../../../core/models';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-admin-citas',
  standalone: true,
  imports: [RouterLink, FormsModule, SlicePipe],
  templateUrl: './admin-citas.component.html',
})
export class AdminCitasComponent {
  private readonly citaService = inject(CitaService);
  private readonly auth = inject(AuthService);

  readonly citas = signal<Cita[]>([]);
  readonly loading = signal(true);
  readonly filtroEstado = signal<string>('todos');
  readonly busqueda = signal('');

  readonly estados = [
    { valor: 'todos', label: 'Todas' },
    { valor: EstadoCita.PENDIENTE, label: 'Pendientes' },
    { valor: EstadoCita.COMPLETADA, label: 'Completadas' },
    { valor: EstadoCita.CANCELADA, label: 'Canceladas' },
    { valor: EstadoCita.NO_PRESENTADO_CIUDADANO, label: 'No presentado' },
  ];

  readonly citasFiltradas = computed(() => {
  let resultado = this.citas();
  const filtro = this.filtroEstado();
  if (filtro !== 'todos') {
    resultado = resultado.filter((c) => c.estado === filtro);
  }
  const busq = this.busqueda().toLowerCase().trim();
  if (busq) {
    resultado = resultado.filter((c) =>
      c.ciudadano_nombre.toLowerCase().includes(busq) ||
      c.ciudadano_apellidos.toLowerCase().includes(busq) ||
      c.ciudadano_dni.toLowerCase().includes(busq) ||
      c.ciudadano_email.toLowerCase().includes(busq)
    );
  }
  return resultado;
});

  constructor() {
    const tenantId = this.auth.getTenantId();
    if (tenantId) {
      this.citaService.obtenerPorTenant(tenantId).subscribe({
        next: (citas) => { this.citas.set(citas); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
    }
  }

  filtrar(estado: string): void {
    this.filtroEstado.set(estado);
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