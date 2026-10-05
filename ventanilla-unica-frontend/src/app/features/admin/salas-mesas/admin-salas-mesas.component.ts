import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SalaService } from '../../../core/services/sala.service';
import { AuthService } from '../../../core/services/auth.service';
import { Sala, Mesa } from '../../../core/models';

interface SalaConMesas extends Sala {
  mesas: Mesa[];
  expandida: boolean;
}

@Component({
  selector: 'app-admin-salas-mesas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-salas-mesas.component.html',
})
export class AdminSalasMesasComponent {
  private readonly salaService = inject(SalaService);
  private readonly auth = inject(AuthService);

  readonly salas = signal<SalaConMesas[]>([]);
  readonly loading = signal(true);
  readonly errorMsg = signal<string | null>(null);
  readonly successMsg = signal<string | null>(null);

  nuevaSalaNombre = '';
  nuevaSalaDescripcion = '';
  nuevaMesaSalaId: number | null = null;
  nuevaMesaNumero = 1;

  constructor() {
    const tenantId = this.auth.getTenantId();
    if (tenantId) this.cargarSalas(tenantId);
  }

  private cargarSalas(tenantId: number): void {
    this.salaService.obtenerPorTenant(tenantId).subscribe({
      next: (salas) => {
        const salasConMesas = salas.map((s) => ({ ...s, mesas: [] as Mesa[], expandida: false }));
        this.salas.set(salasConMesas);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  toggleSala(sala: SalaConMesas): void {
    sala.expandida = !sala.expandida;
    if (sala.expandida && sala.mesas.length === 0) {
      this.salaService.obtenerMesasPorSala(sala.id).subscribe({
        next: (mesas) => { sala.mesas = mesas; },
      });
    }
  }

  crearSala(): void {
    if (!this.nuevaSalaNombre.trim()) return;
    const tenantId = this.auth.getTenantId()!;
    this.salaService.crear({
      nombre: this.nuevaSalaNombre.trim(),
      descripcion: this.nuevaSalaDescripcion.trim() || undefined,
      tenant_id: tenantId,
    }).subscribe({
      next: (sala) => {
        this.salas.update((list) => [...list, { ...sala, mesas: [], expandida: false }]);
        this.nuevaSalaNombre = '';
        this.nuevaSalaDescripcion = '';
        this.successMsg.set('Sala creada.');
        setTimeout(() => this.successMsg.set(null), 3000);
      },
      error: (err) => this.errorMsg.set(err.error?.message ?? 'Error al crear sala.'),
    });
  }

  crearMesa(salaId: number): void {
    this.salaService.crearMesa({ numero: this.nuevaMesaNumero, sala_id: salaId }).subscribe({
      next: (mesa) => {
        const sala = this.salas().find((s) => s.id === salaId);
        if (sala) sala.mesas = [...sala.mesas, mesa];
        this.nuevaMesaSalaId = null;
        this.successMsg.set('Mesa creada.');
        setTimeout(() => this.successMsg.set(null), 3000);
      },
      error: (err) => this.errorMsg.set(err.error?.message ?? 'Error al crear mesa.'),
    });
  }
}