import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { SalaService } from '../../../core/services/sala.service';
import { AuthService } from '../../../core/services/auth.service';
import { Usuario, Sala, Mesa } from '../../../core/models';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-usuarios.component.html',
})
export class AdminUsuariosComponent {
  private readonly usuarioService = inject(UsuarioService);
  private readonly salaService = inject(SalaService);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly empleados = signal<Usuario[]>([]);
  readonly salas = signal<Sala[]>([]);
  readonly mesasDeSala = signal<Mesa[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly mostrarModal = signal(false);
  readonly successMsg = signal<string | null>(null);
  readonly errorMsg = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    apellidos: ['', [Validators.required, Validators.maxLength(150)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    dni: [''],
    telefono: [''],
    sala_id: [0],
    mesa_id: [0],
  });

  constructor() {
    const tenantId = this.auth.getTenantId();
    if (tenantId) {
      this.cargarEmpleados(tenantId);
      this.cargarSalas(tenantId);
    }
  }

  private cargarEmpleados(tenantId: number): void {
    this.usuarioService.obtenerPorTenant(tenantId).subscribe({
      next: (usuarios) => {
        this.empleados.set(usuarios.filter((u) => u.rol.nombre === 'empleado'));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private cargarSalas(tenantId: number): void {
    this.salaService.obtenerPorTenant(tenantId).subscribe({
      next: (salas) => this.salas.set(salas),
    });
  }

  onSalaChange(salaId: number | string): void {
    const id = Number(salaId);
    if (!id || id === 0) {
      this.mesasDeSala.set([]);
      return;
    }
    this.salaService.obtenerMesasPorSala(id).subscribe({
      next: (mesas) => this.mesasDeSala.set(mesas),
    });
  }

  abrirModal(): void {
    this.form.reset();
    this.mesasDeSala.set([]);
    this.mostrarModal.set(true);
    this.errorMsg.set(null);
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
  }

  crearEmpleado(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMsg.set(null);

    const tenantId = this.auth.getTenantId()!;
    const values = this.form.getRawValue();

    const mesaId = Number(values.mesa_id);
    const datos = {
      nombre: values.nombre,
      apellidos: values.apellidos,
      email: values.email,
      password: values.password,
      dni: values.dni?.trim() || undefined,
      telefono: values.telefono?.trim() || undefined,
      rol_id: 3,
      tenant_id: tenantId,
      mesa_id: mesaId > 0 ? mesaId : undefined,
    };

    this.usuarioService.crear(datos).subscribe({
      next: (empleado) => {
        this.empleados.update((list) => [...list, empleado]);
        this.saving.set(false);
        this.mostrarModal.set(false);
        this.successMsg.set('Empleado creado correctamente.');
        setTimeout(() => this.successMsg.set(null), 3000);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMsg.set(err.error?.message ?? 'Error al crear el empleado.');
      },
    });
  }
  desactivarEmpleado(id: number): void {
    if (!confirm('¿Estás seguro de desactivar este empleado?')) return;

    this.usuarioService.desactivar(id).subscribe({
      next: () => {
        this.empleados.update((list) =>
          list.map((e) => e.id === id ? { ...e, activo: false } : e)
        );
        this.successMsg.set('Empleado desactivado.');
        setTimeout(() => this.successMsg.set(null), 3000);
      },
      error: (err) => this.errorMsg.set(err.error?.message ?? 'Error al desactivar.'),
    });
  }
}