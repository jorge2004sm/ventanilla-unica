import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { TenantService } from '../../../core/services/tenant.service';
import { Usuario, Tenant } from '../../../core/models';

@Component({
  selector: 'app-superadmin-usuarios',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './superadmin-usuarios.component.html',
})
export class SuperadminUsuariosComponent {
  private readonly usuarioService = inject(UsuarioService);
  private readonly tenantService = inject(TenantService);
  private readonly fb = inject(FormBuilder);

  readonly usuarios = signal<Usuario[]>([]);
  readonly tenants = signal<Tenant[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly successMsg = signal<string | null>(null);
  readonly errorMsg = signal<string | null>(null);
  readonly mostrarModal = signal(false);

  readonly roles = [
    { id: 1, nombre: 'superadmin' },
    { id: 2, nombre: 'admin' },
    { id: 3, nombre: 'empleado' },
    { id: 4, nombre: 'ciudadano' },
  ];

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    apellidos: ['', [Validators.required, Validators.maxLength(150)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    dni: [''],
    telefono: [''],
    rol_id: [2, [Validators.required]],
    tenant_id: [0],
  });

  constructor() {
    this.cargarUsuarios();
    this.cargarTenants();
  }

  private cargarUsuarios(): void {
    this.usuarioService.obtenerTodos().subscribe({
      next: (usuarios) => { this.usuarios.set(usuarios); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  private cargarTenants(): void {
    this.tenantService.obtenerTodos().subscribe({
      next: (tenants) => this.tenants.set(tenants.filter((t) => t.activo)),
    });
  }

  abrirModal(): void {
    this.form.reset({ rol_id: 2, tenant_id: 0 });
    this.mostrarModal.set(true);
    this.errorMsg.set(null);
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
  }

  crearUsuario(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMsg.set(null);

    const values = this.form.getRawValue();
    const tenantId = Number(values.tenant_id);

    const datos = {
      nombre: values.nombre,
      apellidos: values.apellidos,
      email: values.email,
      password: values.password,
      dni: values.dni?.trim() || undefined,
      telefono: values.telefono?.trim() || undefined,
      rol_id: Number(values.rol_id),
      tenant_id: tenantId > 0 ? tenantId : undefined,
    };

    this.usuarioService.crear(datos).subscribe({
      next: (usuario) => {
        this.usuarios.update((list) => [...list, usuario]);
        this.saving.set(false);
        this.mostrarModal.set(false);
        this.successMsg.set('Usuario creado.');
        setTimeout(() => this.successMsg.set(null), 3000);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMsg.set(err.error?.message ?? 'Error al crear usuario.');
      },
    });
  }

  desactivarUsuario(id: number): void {
    if (!confirm('¿Estás seguro de desactivar este usuario?')) return;

    this.usuarioService.desactivar(id).subscribe({
      next: () => {
        this.usuarios.update((list) =>
          list.map((u) => u.id === id ? { ...u, activo: false } : u)
        );
        this.successMsg.set('Usuario desactivado.');
        setTimeout(() => this.successMsg.set(null), 3000);
      },
      error: (err) => this.errorMsg.set(err.error?.message ?? 'Error al desactivar.'),
    });
  }

  rolLabel(nombre: string): string {
    const map: Record<string, string> = {
      superadmin: 'Superadmin',
      admin: 'Admin',
      empleado: 'Empleado',
      ciudadano: 'Ciudadano',
    };
    return map[nombre] ?? nombre;
  }

  rolBadgeClass(nombre: string): string {
    const map: Record<string, string> = {
      superadmin: 'bg-purple-100 text-purple-800',
      admin: 'bg-blue-100 text-blue-800',
      empleado: 'bg-green-100 text-green-800',
      ciudadano: 'bg-gray-100 text-gray-800',
    };
    return map[nombre] ?? 'bg-gray-100 text-gray-800';
  }
}