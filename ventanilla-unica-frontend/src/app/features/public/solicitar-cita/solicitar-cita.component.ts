import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TipoTramiteService } from '../../../core/services/tipo-tramite.service';
import { HorarioService } from '../../../core/services/horario.service';
import { CitaService } from '../../../core/services/cita.service';
import { AuthService } from '../../../core/services/auth.service';
import { TipoTramite, Tenant, Horario } from '../../../core/models';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-solicitar-cita',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, JsonPipe],
  templateUrl: './solicitar-cita.component.html',
})
export class SolicitarCitaComponent {
  private readonly tipoTramiteService = inject(TipoTramiteService);
  private readonly horarioService = inject(HorarioService);
  private readonly citaService = inject(CitaService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  // Estado del stepper
  readonly pasoActual = signal(1);
  readonly totalPasos = 4;

  readonly pasos = [
    { numero: 1, titulo: 'Tipo de trámite' },
    { numero: 2, titulo: 'Organización' },
    { numero: 3, titulo: 'Fecha y hora' },
    { numero: 4, titulo: 'Datos del solicitante' },
  ];

  // Datos cargados del backend
  readonly tiposTramite = signal<TipoTramite[]>([]);
  readonly tenants = signal<Tenant[]>([]);
  readonly horarios = signal<Horario[]>([]);
  readonly horasDisponibles = signal<{ hora_inicio: string; hora_fin: string }[]>([]);
  readonly horasOcupadas = signal<string[]>([]);
  readonly horariosEspeciales = signal<Horario[]>([]);

  // Selecciones del usuario
  readonly tipoTramiteSeleccionado = signal<TipoTramite | null>(null);
  readonly tenantSeleccionado = signal<Tenant | null>(null);
  readonly fechaSeleccionada = signal<string>('');
  readonly horaSeleccionada = signal<{ hora_inicio: string; hora_fin: string } | null>(null);

  // Estado de UI
  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);

  // Computed para obtener solo los tipos de trámite únicos (por nombre) y activos
  readonly tiposTramiteUnicos = computed(() => {
    const tipos = this.tiposTramite();
    const vistos = new Set<string>();
    return tipos.filter((t) => {
      if (vistos.has(t.nombre)) return false;
      vistos.add(t.nombre);
      return true;
    });
  });

  // Formulario del paso 4
  readonly datosForm = this.fb.nonNullable.group({
    ciudadano_nombre: ['', [Validators.required, Validators.maxLength(100)]],
    ciudadano_apellidos: ['', [Validators.required, Validators.maxLength(150)]],
    ciudadano_email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    ciudadano_dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}[A-Za-z]$/)]],
    ciudadano_telefono: ['', [Validators.required, Validators.pattern(/^[67][0-9]{8}$/)]],
  });

  // Fecha mínima y máxima para el selector
  readonly fechaMinima = this.calcularFecha(0);
  readonly fechaMaxima = this.calcularFecha(7);

  // Permite avanzar al siguiente paso solo si se han completado los datos necesarios del paso actual
  // Quita el 'readonly' y el 'computed'. Conviértelo en un método:
  puedeAvanzar(): boolean {
    switch (this.pasoActual()) {
      case 1: return this.tipoTramiteSeleccionado() !== null;
      case 2: return this.tenantSeleccionado() !== null;
      case 3: return this.horaSeleccionada() !== null && this.fechaSeleccionada() !== '';
      case 4: return this.datosForm.valid;
      default: return false;
    }
  }

  constructor() {
    this.cargarTiposTramite();
    this.prerellenarDatosCiudadano();
  }

  // Navegación del stepper

  siguiente(): void {
    if (!this.puedeAvanzar()) return;

    if (this.pasoActual() === 4) {
      this.enviarCita();
      return;
    }

    this.pasoActual.update((p) => p + 1);
  }

  anterior(): void {
    this.pasoActual.update((p) => Math.max(1, p - 1));
    this.errorMsg.set(null);
  }

  // Paso 1: Tipos de trámite

  private cargarTiposTramite(): void {
    this.tipoTramiteService.obtenerTodos().subscribe({
      next: (tipos) => this.tiposTramite.set(tipos.filter((t) => t.activo !== false)),
      error: () => this.errorMsg.set('Error al cargar los tipos de trámite.'),
    });
  }

  seleccionarTipoTramite(tipo: TipoTramite): void {
    this.tipoTramiteSeleccionado.set(tipo);
    this.tenantSeleccionado.set(null);
    this.fechaSeleccionada.set('');
    this.horaSeleccionada.set(null);
    this.extraerTenants();
  }

  // Paso 2: Tenants (extraídos de los tipos de trámite)

  private extraerTenants(): void {
    const tipoSeleccionado = this.tipoTramiteSeleccionado();
    if (!tipoSeleccionado) return;

    const tipos = this.tiposTramite().filter(
      (t) => t.nombre === tipoSeleccionado.nombre
    );

    const tenantsMap = new Map<number, Tenant>();
    tipos.forEach((tipo) => {
      if (tipo.tenant && tipo.tenant.activo) {
        tenantsMap.set(tipo.tenant.id, tipo.tenant);
      }
    });

    this.tenants.set(Array.from(tenantsMap.values()));
  }

  seleccionarTenant(tenant: Tenant): void {
    this.tenantSeleccionado.set(tenant);
    this.fechaSeleccionada.set('');
    this.horaSeleccionada.set(null);

    const tipoDelTenant = this.tiposTramite().find(
      (t) => t.nombre === this.tipoTramiteSeleccionado()?.nombre && t.tenant.id === tenant.id
    );
    if (tipoDelTenant) {
      this.tipoTramiteSeleccionado.set(tipoDelTenant);
    }

    this.cargarHorarios(tenant.id);
  }
  // Paso 3: Fecha y hora

  private cargarHorarios(tenantId: number): void {
    this.horarioService.obtenerBasePorTenant(tenantId).subscribe({
      next: (horarios) => this.horarios.set(horarios),
      error: () => this.errorMsg.set('Error al cargar los horarios.'),
    });
    this.horarioService.obtenerEspecialesPorTenant(tenantId).subscribe({
      next: (especiales) => this.horariosEspeciales.set(especiales),
    });
  }


  seleccionarFecha(fecha: string): void {
    this.fechaSeleccionada.set(fecha);
    this.horaSeleccionada.set(null);

    const tenant = this.tenantSeleccionado();
    if (!tenant) return;

    // Comprobar si es festivo
    this.horarioService.obtenerEspecialesPorTenant(tenant.id).subscribe({
      next: (especiales) => {
        const esFestivo = especiales.some(
          (h) => h.es_festivo && h.fecha_inicio && h.fecha_fin && fecha >= h.fecha_inicio && fecha <= h.fecha_fin
        );

        if (esFestivo) {
          this.horasDisponibles.set([]);
          this.errorMsg.set('El día seleccionado es festivo. No hay atención al público.');
          return;
        }

        this.errorMsg.set(null);
        this.generarHorasDisponibles(fecha);

        // Cargar horas ocupadas
        this.citaService.obtenerHorasOcupadas(tenant.id, fecha).subscribe({
          next: (ocupadas) => this.horasOcupadas.set(ocupadas),
          error: () => this.horasOcupadas.set([]),
        });
      },
      error: () => {
        this.generarHorasDisponibles(fecha);
      },
    });
  }

  private generarHorasDisponibles(fecha: string): void {
  const fechaDate = new Date(fecha);
  const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const diaSemana = diasSemana[fechaDate.getUTCDay()];

  // 1. Buscar horario especial para esta fecha (no festivo)
  const horarioEspecial = this.horariosEspeciales().find(
    (h) => !h.es_festivo && h.activo && h.fecha_inicio && h.fecha_fin && fecha >= h.fecha_inicio && fecha <= h.fecha_fin
  );

  // 2. Si no hay especial, buscar horario base del día
  const horarioBase = this.horarios().find((h) => h.dia_semana === diaSemana && h.activo);

  // 3. Usar el especial si existe, si no el base
  const horarioActivo = horarioEspecial ?? horarioBase;

  if (!horarioActivo) {
    this.horasDisponibles.set([]);
    return;
  }

  const slots: { hora_inicio: string; hora_fin: string }[] = [];
  const duracion = horarioActivo.duracion_cita || 30;

  // Normalizar horas (quitar segundos si vienen como HH:mm:ss)
  const horaInicioStr = horarioActivo.hora_inicio.slice(0, 5);
  const horaFinStr = horarioActivo.hora_fin.slice(0, 5);

  let [h, m] = horaInicioStr.split(':').map(Number);
  const [hFin, mFin] = horaFinStr.split(':').map(Number);
  const finEnMinutos = hFin * 60 + mFin;

  while (h * 60 + m + duracion <= finEnMinutos) {
    const inicio = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    const totalMin = h * 60 + m + duracion;
    const finH = Math.floor(totalMin / 60);
    const finM = totalMin % 60;
    const fin = `${String(finH).padStart(2, '0')}:${String(finM).padStart(2, '0')}`;

    slots.push({ hora_inicio: inicio, hora_fin: fin });

    m += duracion;
    if (m >= 60) {
      h += Math.floor(m / 60);
      m = m % 60;
    }
  }

  this.horasDisponibles.set(slots);
}

  seleccionarHora(slot: { hora_inicio: string; hora_fin: string }): void {
    this.horaSeleccionada.set(slot);
  }

  // Paso 4: Datos del solicitante

  private prerellenarDatosCiudadano(): void {
    const user = this.auth.user();
    if (user) {
      this.datosForm.patchValue({
        ciudadano_nombre: user.nombre,
        ciudadano_apellidos: user.apellidos,
        ciudadano_email: user.email,
      });
    }
  }

  // Enviar cita

  private enviarCita(): void {
    if (this.datosForm.invalid) {
      this.datosForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMsg.set(null);

    const hora = this.horaSeleccionada()!;
    const datos = {
      ...this.datosForm.getRawValue(),
      fecha: this.fechaSeleccionada(),
      hora_inicio: hora.hora_inicio,
      hora_fin: hora.hora_fin,
      tenant_id: this.tenantSeleccionado()!.id,
      tipo_tramite_id: this.tipoTramiteSeleccionado()!.id,
      ciudadano_id: this.auth.user()?.id,
    };

    this.citaService.crear(datos).subscribe({
      next: (cita) => {
        this.router.navigate(['/cita/confirmacion', cita.id]);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(
          err.error?.message ?? 'No se pudo crear la cita. Inténtalo de nuevo.'
        );
      },
    });
  }

  // Metodo auxiliar para calcular fechas en formato YYYY-MM-DD

  private calcularFecha(diasDesdeHoy: number): string {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + diasDesdeHoy);
    return fecha.toISOString().split('T')[0];
  }
  // Verificar si una hora está ocupada
  estaOcupada(hora: string): boolean {
    return this.horasOcupadas().includes(hora);
  }

  // Ir al paso clickeado en el stepper (solo hacia atrás)
  irAPaso(paso: number): void {
    // Solo permite ir hacia atrás, no adelante
    if (paso >= this.pasoActual()) return;

    this.pasoActual.set(paso);
    this.errorMsg.set(null);

    // Resetear selecciones de los pasos posteriores al destino
    if (paso <= 1) {
      this.tipoTramiteSeleccionado.set(null);
      this.tenantSeleccionado.set(null);
      this.fechaSeleccionada.set('');
      this.horaSeleccionada.set(null);
    } else if (paso <= 2) {
      this.tenantSeleccionado.set(null);
      this.fechaSeleccionada.set('');
      this.horaSeleccionada.set(null);
    } else if (paso <= 3) {
      this.fechaSeleccionada.set('');
      this.horaSeleccionada.set(null);
    }
  }
}