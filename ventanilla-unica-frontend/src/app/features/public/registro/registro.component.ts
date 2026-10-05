import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
})
export class RegistroComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    apellidos: ['', [Validators.required, Validators.maxLength(150)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
    confirmPassword: ['', [Validators.required]],
    dni: ['', [Validators.maxLength(20)]],
    telefono: ['', [Validators.maxLength(20)]],
  }, { validators: this.passwordsMatch });

  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMsg.set(null);

    const { confirmPassword, dni, telefono, ...rest } = this.form.getRawValue();

    const payload = {
      ...rest,
      dni: dni?.trim() || undefined,
      telefono: telefono?.trim() || undefined,
    };

    this.auth.registro(payload).subscribe({
      next: () => {
        this.router.navigateByUrl('/ciudadano/mis-citas');
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(
          err.error?.message ?? 'No se pudo completar el registro. Inténtalo de nuevo.'
        );
      },
    });
  }

  private passwordsMatch(group: any): { passwordsMismatch: true } | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass && confirm && pass !== confirm ? { passwordsMismatch: true } : null;
  }
}