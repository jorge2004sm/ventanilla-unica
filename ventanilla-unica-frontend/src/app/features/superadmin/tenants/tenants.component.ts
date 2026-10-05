import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TenantService } from '../../../core/services/tenant.service';
import { Tenant } from '../../../core/models';

@Component({
  selector: 'app-tenants',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './tenants.component.html',
})
export class TenantsComponent {
  private readonly tenantService = inject(TenantService);
  private readonly fb = inject(FormBuilder);

  readonly tenants = signal<Tenant[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly successMsg = signal<string | null>(null);
  readonly errorMsg = signal<string | null>(null);
  readonly mostrarForm = signal(false);
  readonly editandoId = signal<number | null>(null);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(150)]],
    direccion: [''],
    telefono: [''],
    email: [''],
  });

  constructor() {
    this.cargarTenants();
  }

  private cargarTenants(): void {
    this.tenantService.obtenerTodos().subscribe({
      next: (tenants) => { this.tenants.set(tenants); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  abrirFormCrear(): void {
    this.editandoId.set(null);
    this.form.reset();
    this.mostrarForm.set(true);
    this.errorMsg.set(null);
  }

  editarTenant(tenant: Tenant): void {
    this.editandoId.set(tenant.id);
    this.form.patchValue({
      nombre: tenant.nombre,
      direccion: tenant.direccion ?? '',
      telefono: tenant.telefono ?? '',
      email: tenant.email ?? '',
    });
    this.mostrarForm.set(true);
    this.errorMsg.set(null);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMsg.set(null);

    const values = this.form.getRawValue();
    const datos = {
      nombre: values.nombre,
      direccion: values.direccion?.trim() || undefined,
      telefono: values.telefono?.trim() || undefined,
      email: values.email?.trim() || undefined,
    };

    if (this.editandoId()) {
      this.tenantService.actualizar(this.editandoId()!, datos).subscribe({
        next: (tenantActualizado) => {
          this.tenants.update((list) =>
            list.map((t) => t.id === tenantActualizado.id ? tenantActualizado : t)
          );
          this.saving.set(false);
          this.mostrarForm.set(false);
          this.editandoId.set(null);
          this.successMsg.set('Tenant actualizado.');
          setTimeout(() => this.successMsg.set(null), 3000);
        },
        error: (err) => {
          this.saving.set(false);
          this.errorMsg.set(err.error?.message ?? 'Error al actualizar.');
        },
      });
    } else {
      this.tenantService.crear(datos).subscribe({
        next: (tenant) => {
          this.tenants.update((list) => [...list, tenant]);
          this.saving.set(false);
          this.mostrarForm.set(false);
          this.form.reset();
          this.successMsg.set('Tenant creado.');
          setTimeout(() => this.successMsg.set(null), 3000);
        },
        error: (err) => {
          this.saving.set(false);
          this.errorMsg.set(err.error?.message ?? 'Error al crear.');
        },
      });
    }
  }

  desactivarTenant(id: number): void {
    if (!confirm('¿Estás seguro de desactivar este tenant?')) return;

    this.tenantService.desactivar(id).subscribe({
      next: () => {
        this.tenants.update((list) =>
          list.map((t) => t.id === id ? { ...t, activo: false } : t)
        );
        this.successMsg.set('Tenant desactivado.');
        setTimeout(() => this.successMsg.set(null), 3000);
      },
      error: (err) => this.errorMsg.set(err.error?.message ?? 'Error al desactivar.'),
    });
  }

  cancelarForm(): void {
    this.mostrarForm.set(false);
    this.editandoId.set(null);
  }
}