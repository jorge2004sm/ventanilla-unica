import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-staff-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './staff-login.component.html',
})
export class StaffLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMsg.set(null);

    const { email, password } = this.form.getRawValue();

    this.auth.login(email, password).subscribe({
      next: (res) => {
        const rol = res.usuario.rol;

        // Si por error un ciudadano se cuela por aquí, lo rechazamos
        if (rol === 'ciudadano') {
          this.auth.logout();
          this.loading.set(false);
          this.errorMsg.set('Esta área es solo para personal autorizado.');
          return;
        }

        this.redirectByRole(rol);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(
          err.error?.message ?? 'No se pudo iniciar sesión. Inténtalo de nuevo.'
        );
      },
    });
  }

  private redirectByRole(rol: string): void {
    const rutas: Record<string, string> = {
      empleado: '/empleado/dashboard',
      admin: '/admin/dashboard',
      superadmin: '/superadmin/tenants',
    };
    this.router.navigateByUrl(rutas[rol] ?? '/');
  }
}