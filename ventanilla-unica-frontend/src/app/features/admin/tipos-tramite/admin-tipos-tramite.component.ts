import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TipoTramiteService } from '../../../core/services/tipo-tramite.service';
import { AuthService } from '../../../core/services/auth.service';
import { TipoTramite } from '../../../core/models';

@Component({
  selector: 'app-admin-tipos-tramite',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-tipos-tramite.component.html',
})
export class AdminTiposTramiteComponent {
  private readonly tipoTramiteService = inject(TipoTramiteService);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly tipos = signal<TipoTramite[]>([]);
  readonly loading = signal(true);
  readonly mostrarForm = signal(false);
  readonly saving = signal(false);
  readonly successMsg = signal<string | null>(null);
  readonly errorMsg = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(150)]],
    descripcion: [''],
    requisitos_documentos: [''],
  });

  constructor() {
    const tenantId = this.auth.getTenantId();
    if (tenantId) {
      this.tipoTramiteService.obtenerPorTenant(tenantId).subscribe({
        next: (tipos) => { this.tipos.set(tipos); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
    }
  }

  crear(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    this.errorMsg.set(null);
    const tenantId = this.auth.getTenantId()!;
    const values = this.form.getRawValue();

    this.tipoTramiteService.crear({
      nombre: values.nombre,
      descripcion: values.descripcion?.trim() || undefined,
      requisitos_documentos: values.requisitos_documentos?.trim() || undefined,
      tenant_id: tenantId,
    }).subscribe({
      next: (tipo) => {
        this.tipos.update((list) => [...list, tipo]);
        this.saving.set(false);
        this.mostrarForm.set(false);
        this.form.reset();
        this.successMsg.set('Tipo de trámite creado.');
        setTimeout(() => this.successMsg.set(null), 3000);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMsg.set(err.error?.message ?? 'Error al crear.');
      },
    });
  }

  desactivarTipo(id: number): void {
  if (!confirm('¿Estás seguro de desactivar este tipo de trámite?')) return;

  this.tipoTramiteService.actualizar(id, { activo: false }).subscribe({
    next: () => {
      this.tipos.update((list) =>
        list.map((t) => t.id === id ? { ...t, activo: false } : t)
      );
      this.successMsg.set('Tipo de trámite desactivado.');
      setTimeout(() => this.successMsg.set(null), 3000);
    },
    error: (err) => this.errorMsg.set(err.error?.message ?? 'Error al desactivar.'),
  });
}
}