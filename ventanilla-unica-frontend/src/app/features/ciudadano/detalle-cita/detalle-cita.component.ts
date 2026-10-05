import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';
import { Cita } from '../../../core/models';
import { DatePipe, SlicePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-detalle-cita',
  standalone: true,
  imports: [RouterLink, SlicePipe, DatePipe],
  templateUrl: './detalle-cita.component.html',
})
export class DetalleCitaComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly citaService = inject(CitaService);
  readonly apiUrl = environment.apiUrl;

  readonly cita = signal<Cita | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarCita(id);
  }

  private cargarCita(id: number): void {
    this.citaService.obtenerPorId(id).subscribe({
      next: (cita) => {
        this.cita.set(cita);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
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