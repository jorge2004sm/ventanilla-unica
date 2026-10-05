import { Component, inject, signal, computed, ViewChild, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { CitaService } from '../../../core/services/cita.service';
import { VacacionService } from '../../../core/services/vacacion.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { Cita, EstadoCita, Vacacion } from '../../../core/models';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, BaseChartDirective, SlicePipe],
  templateUrl: './dashboard.component.html',
})
export class AdminDashboardComponent implements AfterViewInit {
  private readonly citaService = inject(CitaService);
  private readonly vacacionService = inject(VacacionService);
  private readonly usuarioService = inject(UsuarioService);
  readonly auth = inject(AuthService);

  readonly citas = signal<Cita[]>([]);
  readonly vacacionesPendientes = signal<Vacacion[]>([]);
  readonly totalEmpleados = signal(0);
  readonly loading = signal(true);

  readonly metricas = computed(() => {
    const todas = this.citas();
    const hoy = new Date().toISOString().split('T')[0];
    const citasHoy = todas.filter((c) => c.fecha === hoy);
    const pendientes = todas.filter((c) => c.estado === EstadoCita.PENDIENTE);

    return {
      citasHoy: citasHoy.length,
      empleados: this.totalEmpleados(),
      vacacionesPendientes: this.vacacionesPendientes().length,
    };
  });

  // Gráfica de barras: citas por día de la semana
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Pendientes',
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: '#EAB308',
      },
      {
        label: 'Completadas',
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: '#22C55E',
      },
    ],
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  // Gráfica de pie: distribución de estados
  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Pendientes', 'Completadas', 'Canceladas', 'No presentado'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#EAB308', '#22C55E', '#EF4444', '#9CA3AF'],
    }],
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'right' } },
  };

  constructor() {
    const tenantId = this.auth.getTenantId();
    if (tenantId) {
      this.cargarDatos(tenantId);
    }
  }

  ngAfterViewInit(): void { }

  private cargarDatos(tenantId: number): void {
    this.citaService.obtenerPorTenant(tenantId).subscribe({
      next: (citas) => {
        this.citas.set(citas);
        this.actualizarGraficas(citas);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.vacacionService.obtenerPendientes().subscribe({
      next: (v) => this.vacacionesPendientes.set(v),
    });

    this.usuarioService.obtenerPorTenant(tenantId).subscribe({
      next: (u) => this.totalEmpleados.set(u.filter((e) => e.rol.nombre === 'empleado' && e.activo === true).length),
    });
  }

  private actualizarGraficas(citas: Cita[]): void {
    // Calcular inicio y fin de la semana actual (lunes a domingo)
    const hoy = new Date();
    const diaHoy = hoy.getDay(); // 0=domingo, 1=lunes...
    const diffLunes = diaHoy === 0 ? -6 : 1 - diaHoy;

    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() + diffLunes);
    lunes.setHours(0, 0, 0, 0);

    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);
    domingo.setHours(23, 59, 59, 999);

    const lunesStr = lunes.toISOString().split('T')[0];
    const domingoStr = domingo.toISOString().split('T')[0];

    // Filtrar solo citas de esta semana
    const citasSemana = citas.filter((c) => c.fecha >= lunesStr && c.fecha <= domingoStr);

    const porDia = [0, 0, 0, 0, 0, 0, 0];
    const porDiaCompletadas = [0, 0, 0, 0, 0, 0, 0];

    citasSemana.forEach((c) => {
      const dia = new Date(c.fecha).getUTCDay();
      const idx = dia === 0 ? 6 : dia - 1; // lunes=0, domingo=6
      if (c.estado === EstadoCita.PENDIENTE) porDia[idx]++;
      if (c.estado === EstadoCita.COMPLETADA) porDiaCompletadas[idx]++;
    });

    this.barChartData = {
      ...this.barChartData,
      datasets: [
        { ...this.barChartData.datasets[0], data: porDia },
        { ...this.barChartData.datasets[1], data: porDiaCompletadas },
      ],
    };

    // Pie chart: todas las citas (no solo esta semana)
    const pendientes = citas.filter((c) => c.estado === EstadoCita.PENDIENTE).length;
    const completadas = citas.filter((c) => c.estado === EstadoCita.COMPLETADA).length;
    const canceladas = citas.filter((c) => c.estado === EstadoCita.CANCELADA).length;
    const noPresentado = citas.filter((c) =>
      c.estado === EstadoCita.NO_PRESENTADO_CIUDADANO || c.estado === EstadoCita.NO_PRESENTADO_EMPLEADO
    ).length;

    this.pieChartData = {
      ...this.pieChartData,
      datasets: [{ ...this.pieChartData.datasets[0], data: [pendientes, completadas, canceladas, noPresentado] }],
    };
  }

  badgeClass(estado: string): string {
    const map: Record<string, string> = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      aprobada: 'bg-green-100 text-green-800',
      rechazada: 'bg-red-100 text-red-800',
    };
    return map[estado] ?? 'bg-gray-100 text-gray-800';
  }
}