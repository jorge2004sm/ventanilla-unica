import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';
import { Cita} from '../../../core/models';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-confirmacion-cita',
  standalone: true,
  imports: [RouterLink, SlicePipe],
  templateUrl: './confirmacion-cita.component.html',
})
export class ConfirmacionCitaComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly citaService = inject(CitaService);

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
}