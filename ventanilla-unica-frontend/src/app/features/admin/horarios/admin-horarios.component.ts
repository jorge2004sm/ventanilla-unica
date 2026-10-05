import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HorarioService } from '../../../core/services/horario.service';
import { AuthService } from '../../../core/services/auth.service';
import { Horario, TipoHorario, DiaSemana } from '../../../core/models';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-admin-horarios',
  standalone: true,
  imports: [ReactiveFormsModule, SlicePipe],
  templateUrl: './admin-horarios.component.html',
})
export class AdminHorariosComponent {
  private readonly horarioService = inject(HorarioService);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly horariosBase = signal<Horario[]>([]);
  readonly horariosEspeciales = signal<Horario[]>([]);
  readonly festivos = signal<Horario[]>([]);
  readonly loading = signal(true);
  readonly tabActiva = signal<'base' | 'especiales' | 'festivos'>('base');
  readonly mostrarForm = signal(false);
  readonly saving = signal(false);
  readonly successMsg = signal<string | null>(null);
  readonly errorMsg = signal<string | null>(null);
  readonly editandoId = signal<number | null>(null);

  readonly diasSemana = Object.values(DiaSemana);

  readonly form = this.fb.nonNullable.group({
    tipo: [TipoHorario.BASE, [Validators.required]],
    dia_semana: [''],
    fecha_inicio: [''],
    fecha_fin: [''],
    hora_inicio: [''],
    hora_fin: [''],
    duracion_cita: [30],
    es_festivo: [false],
    descripcion: [''],
  });

  constructor() {
    const tenantId = this.auth.getTenantId();
    if (tenantId) this.cargarHorarios(tenantId);
  }

  private cargarHorarios(tenantId: number): void {
    this.horarioService.obtenerBasePorTenant(tenantId).subscribe({
      next: (h) => { this.horariosBase.set(h); this.loading.set(false); },
    });
    this.horarioService.obtenerEspecialesPorTenant(tenantId).subscribe({
      next: (h) => {
        this.horariosEspeciales.set(h.filter((x) => !x.es_festivo));
        this.festivos.set(h.filter((x) => x.es_festivo));
      },
    });
  }

  cambiarTab(tab: 'base' | 'especiales' | 'festivos'): void {
    this.tabActiva.set(tab);
    this.mostrarForm.set(false);
    this.editandoId.set(null);
  }

  abrirForm(): void {
    const tab = this.tabActiva();
    this.editandoId.set(null);
    this.form.reset({ duracion_cita: 30, es_festivo: tab === 'festivos' });

    if (tab === 'base') this.form.controls.tipo.setValue(TipoHorario.BASE);
    else this.form.controls.tipo.setValue(TipoHorario.ESPECIAL);

    this.mostrarForm.set(true);
    this.errorMsg.set(null);
  }

  editarHorario(horario: Horario): void {
    this.editandoId.set(horario.id);
    this.form.patchValue({
      tipo: horario.tipo,
      dia_semana: horario.dia_semana ?? '',
      fecha_inicio: horario.fecha_inicio ?? '',
      fecha_fin: horario.fecha_fin ?? '',
      hora_inicio: horario.hora_inicio?.slice(0, 5) ?? '',
      hora_fin: horario.hora_fin?.slice(0, 5) ?? '',
      duracion_cita: horario.duracion_cita ?? 30,
      es_festivo: horario.es_festivo,
      descripcion: horario.descripcion ?? '',
    });
    this.mostrarForm.set(true);
    this.errorMsg.set(null);
  }

  guardar(): void {
    this.saving.set(true);
    this.errorMsg.set(null);
    const tenantId = this.auth.getTenantId()!;
    const values = this.form.getRawValue();

    const datos: any = {
      hora_inicio: values.es_festivo ? '00:00' : values.hora_inicio,
      hora_fin: values.es_festivo ? '23:59' : values.hora_fin,
      duracion_cita: values.duracion_cita || 30,
      es_festivo: values.es_festivo,
      descripcion: values.descripcion?.trim() || undefined,
    };

    if (this.editandoId()) {
      // Editar
      if (values.dia_semana) datos.dia_semana = values.dia_semana;
      if (values.fecha_inicio) datos.fecha_inicio = values.fecha_inicio;
      if (values.fecha_fin) datos.fecha_fin = values.fecha_fin;

      this.horarioService.actualizar(this.editandoId()!, datos).subscribe({
        next: () => {
          this.saving.set(false);
          this.mostrarForm.set(false);
          this.editandoId.set(null);
          this.successMsg.set('Horario actualizado.');
          setTimeout(() => this.successMsg.set(null), 3000);
          this.cargarHorarios(tenantId);
        },
        error: (err) => {
          this.saving.set(false);
          this.errorMsg.set(err.error?.message ?? 'Error al actualizar.');
        },
      });
    } else {
      // Crear
      datos.tipo = values.tipo;
      datos.tenant_id = tenantId;
      if (values.tipo === TipoHorario.BASE && values.dia_semana) datos.dia_semana = values.dia_semana;
      if (values.tipo === TipoHorario.ESPECIAL) {
        if (values.fecha_inicio) datos.fecha_inicio = values.fecha_inicio;
        if (values.fecha_fin) datos.fecha_fin = values.fecha_fin;
      }

      this.horarioService.crear(datos).subscribe({
        next: () => {
          this.saving.set(false);
          this.mostrarForm.set(false);
          this.successMsg.set('Horario creado.');
          setTimeout(() => this.successMsg.set(null), 3000);
          this.cargarHorarios(tenantId);
        },
        error: (err) => {
          this.saving.set(false);
          this.errorMsg.set(err.error?.message ?? 'Error al crear.');
        },
      });
    }
  }

  desactivarHorario(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este horario?')) return;

    const tenantId = this.auth.getTenantId()!;
    this.horarioService.desactivar(id).subscribe({
      next: () => {
        this.successMsg.set('Horario eliminado.');
        setTimeout(() => this.successMsg.set(null), 3000);
        this.cargarHorarios(tenantId);
      },
      error: (err) => this.errorMsg.set(err.error?.message ?? 'Error al eliminar.'),
    });
  }

  cancelarForm(): void {
    this.mostrarForm.set(false);
    this.editandoId.set(null);
  }

  diaLabel(dia: string): string {
    return dia.charAt(0).toUpperCase() + dia.slice(1);
  }
}