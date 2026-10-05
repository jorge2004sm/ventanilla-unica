import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VacacionService } from '../../../core/services/vacacion.service';
import { CitaService } from '../../../core/services/cita.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { Vacacion, Cita, Usuario } from '../../../core/models';
import { SlicePipe } from '@angular/common';

interface EmpleadoConOcupacion extends Usuario {
  citasEnFechas: number;
}

@Component({
  selector: 'app-admin-vacaciones',
  standalone: true,
  imports: [FormsModule, SlicePipe],
  templateUrl: './admin-vacaciones.component.html',
})
export class AdminVacacionesComponent {
  private readonly vacacionService = inject(VacacionService);
  private readonly citaService = inject(CitaService);
  private readonly usuarioService = inject(UsuarioService);
  readonly auth = inject(AuthService);

  readonly vacaciones = signal<Vacacion[]>([]);
  readonly loading = signal(true);
  readonly successMsg = signal<string | null>(null);
  readonly errorMsg = signal<string | null>(null);

  readonly empleadosDisponibles = signal<Usuario[]>([]);
  readonly citasAfectadas = signal<Cita[]>([]);
  readonly empleadosConOcupacion = signal<EmpleadoConOcupacion[]>([]);
  readonly vacacionReasignando = signal<number | null>(null);
  readonly reasignando = signal(false);
  empleadoReasignar = 0;

  constructor() {
    this.cargarVacaciones();
    this.cargarEmpleados();
  }

  private cargarVacaciones(): void {
    this.vacacionService.obtenerPendientes().subscribe({
      next: (v) => { this.vacaciones.set(v); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  private cargarEmpleados(): void {
    const tenantId = this.auth.getTenantId();
    if (tenantId) {
      this.usuarioService.obtenerPorTenant(tenantId).subscribe({
        next: (u) => this.empleadosDisponibles.set(u.filter((e) => e.rol.nombre === 'empleado' && e.activo)),
      });
    }
  }

  verCitasAfectadas(vacacion: Vacacion): void {
    if (this.vacacionReasignando() === vacacion.id) {
      this.vacacionReasignando.set(null);
      this.citasAfectadas.set([]);
      this.empleadosConOcupacion.set([]);
      return;
    }

    this.vacacionReasignando.set(vacacion.id);

    this.vacacionService.obtenerCitasAfectadas(vacacion.id).subscribe({
      next: (citas) => this.citasAfectadas.set(citas),
      error: () => this.citasAfectadas.set([]),
    });

    const empleados = this.empleadosDisponibles().filter((e) => e.id !== vacacion.usuario.id);
    const tenantId = this.auth.getTenantId()!;

    this.citaService.obtenerPorTenant(tenantId).subscribe({
      next: (todasCitas) => {
        const conOcupacion = empleados.map((emp) => {
          const citasEmp = todasCitas.filter(
            (c) =>
              c.empleado.id === emp.id &&
              c.estado === 'pendiente' &&
              c.fecha >= vacacion.fecha_inicio &&
              c.fecha <= vacacion.fecha_fin
          );
          return { ...emp, citasEnFechas: citasEmp.length };
        });

        conOcupacion.sort((a, b) => a.citasEnFechas - b.citasEnFechas);
        this.empleadosConOcupacion.set(conOcupacion);
      },
      error: () => {
        this.empleadosConOcupacion.set(empleados.map((e) => ({ ...e, citasEnFechas: 0 })));
      },
    });
  }

  reasignarCita(citaId: number): void {
    if (!this.empleadoReasignar || this.empleadoReasignar === 0) {
      this.errorMsg.set('Selecciona un empleado para reasignar.');
      return;
    }

    this.reasignando.set(true);
    this.citaService.reasignar(citaId, Number(this.empleadoReasignar)).subscribe({
      next: () => {
        this.citasAfectadas.update((list) => list.filter((c) => c.id !== citaId));
        this.reasignando.set(false);
        this.successMsg.set('Cita reasignada.');
        setTimeout(() => this.successMsg.set(null), 3000);
      },
      error: (err) => {
        this.reasignando.set(false);
        this.errorMsg.set(err.error?.message ?? 'Error al reasignar.');
      },
    });
  }

  reasignarTodas(): void {
    if (!this.empleadoReasignar || this.empleadoReasignar === 0) {
      this.errorMsg.set('Selecciona un empleado para reasignar.');
      return;
    }

    this.reasignando.set(true);
    const citas = this.citasAfectadas();
    let completadas = 0;

    citas.forEach((cita) => {
      this.citaService.reasignar(cita.id, Number(this.empleadoReasignar)).subscribe({
        next: () => {
          completadas++;
          if (completadas === citas.length) {
            this.citasAfectadas.set([]);
            this.reasignando.set(false);
            this.successMsg.set(`${completadas} citas reasignadas.`);
            setTimeout(() => this.successMsg.set(null), 3000);
          }
        },
        error: () => {
          completadas++;
          if (completadas === citas.length) {
            this.reasignando.set(false);
            this.errorMsg.set('Algunas citas no se pudieron reasignar.');
          }
        },
      });
    });
  }

  aprobar(id: number): void {
    this.vacacionService.aprobar(id).subscribe({
      next: () => {
        this.vacaciones.update((list) => list.filter((v) => v.id !== id));
        this.successMsg.set('Vacación aprobada.');
        this.vacacionReasignando.set(null);
        this.citasAfectadas.set([]);
        this.empleadosConOcupacion.set([]);
        setTimeout(() => this.successMsg.set(null), 3000);
      },
      error: (err) => this.errorMsg.set(err.error?.message ?? 'Error al aprobar.'),
    });
  }

  rechazar(id: number): void {
    this.vacacionService.rechazar(id).subscribe({
      next: () => {
        this.vacaciones.update((list) => list.filter((v) => v.id !== id));
        this.successMsg.set('Vacación rechazada.');
        this.vacacionReasignando.set(null);
        this.citasAfectadas.set([]);
        this.empleadosConOcupacion.set([]);
        setTimeout(() => this.successMsg.set(null), 3000);
      },
      error: (err) => this.errorMsg.set(err.error?.message ?? 'Error al rechazar.'),
    });
  }

  tipoLabel(tipo: string): string {
    const map: Record<string, string> = {
      vacaciones: 'Vacaciones', baja_medica: 'Baja médica', asuntos_propios: 'Asuntos propios',
    };
    return map[tipo] ?? tipo;
  }
}