import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VacacionService } from '../../../core/services/vacacion.service';
import { AuthService } from '../../../core/services/auth.service';
import { Vacacion, TipoVacacion, EstadoVacacion } from '../../../core/models';

@Component({
  selector: 'app-mis-vacaciones',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './mis-vacaciones.component.html',
})
export class MisVacacionesComponent {
  private readonly vacacionService = inject(VacacionService);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly vacaciones = signal<Vacacion[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly successMsg = signal<string | null>(null);
  readonly errorMsg = signal<string | null>(null);
  readonly mostrarFormulario = signal(false);

  readonly form = this.fb.nonNullable.group({
    fecha_inicio: ['', [Validators.required]],
    fecha_fin: ['', [Validators.required]],
    tipo: [TipoVacacion.VACACIONES, [Validators.required]],
    motivo: [''],
  });

  readonly tiposVacacion = [
    { valor: TipoVacacion.VACACIONES, label: 'Vacaciones' },
    { valor: TipoVacacion.BAJA_MEDICA, label: 'Baja médica' },
    { valor: TipoVacacion.ASUNTOS_PROPIOS, label: 'Asuntos propios' },
  ];

  constructor() {
    this.cargarVacaciones();
  }

  private cargarVacaciones(): void {
    this.vacacionService.obtenerMisVacaciones().subscribe({
      next: (vacaciones) => {
        this.vacaciones.set(vacaciones);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  toggleFormulario(): void {
    this.mostrarFormulario.update((v) => !v);
    this.successMsg.set(null);
    this.errorMsg.set(null);
  }

  solicitar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.successMsg.set(null);
    this.errorMsg.set(null);

    const userId = this.auth.user()?.id;
    if (!userId) return;

    const datos = {
      ...this.form.getRawValue(),
      usuario_id: userId,
      motivo: this.form.getRawValue().motivo?.trim() || undefined,
    };

    this.vacacionService.solicitar(datos).subscribe({
      next: (vacacion) => {
        this.vacaciones.update((list) => [vacacion, ...list]);
        this.saving.set(false);
        this.successMsg.set('Solicitud enviada correctamente.');
        this.mostrarFormulario.set(false);
        this.form.reset({ tipo: TipoVacacion.VACACIONES });
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMsg.set(
          err.error?.message ?? 'No se pudo enviar la solicitud.'
        );
      },
    });
  }

  badgeClass(estado: string): string {
    switch (estado) {
      case EstadoVacacion.PENDIENTE: return 'bg-yellow-100 text-yellow-800';
      case EstadoVacacion.APROBADA: return 'bg-green-100 text-green-800';
      case EstadoVacacion.RECHAZADA: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  estadoLabel(estado: string): string {
    switch (estado) {
      case EstadoVacacion.PENDIENTE: return 'Pendiente';
      case EstadoVacacion.APROBADA: return 'Aprobada';
      case EstadoVacacion.RECHAZADA: return 'Rechazada';
      default: return estado;
    }
  }

  tipoLabel(tipo: string): string {
    switch (tipo) {
      case TipoVacacion.VACACIONES: return 'Vacaciones';
      case TipoVacacion.BAJA_MEDICA: return 'Baja médica';
      case TipoVacacion.ASUNTOS_PROPIOS: return 'Asuntos propios';
      default: return tipo;
    }
  }
}