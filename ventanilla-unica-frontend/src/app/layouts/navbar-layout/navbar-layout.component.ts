import { Component, inject, signal, computed } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

interface NavLink {
  label: string;
  route: string;
}

@Component({
  selector: 'app-navbar-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './navbar-layout.component.html',
})
export class NavbarLayoutComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly mobileMenuOpen = signal(false);

  readonly navLinks = computed<NavLink[]>(() => {
    const user = this.auth.user();

    if (!user) {
      return [
        { label: 'Inicio', route: '/' },
        { label: 'Solicitar cita', route: '/solicitar-cita' },
      ];
    }

    switch (user.rol) {
      case 'empleado':
        return [
          { label: 'Dashboard', route: '/empleado/dashboard' },
          { label: 'Mis vacaciones', route: '/empleado/mis-vacaciones' },
        ];
      case 'ciudadano':
        return [
          { label: 'Inicio', route: '/' },
          { label: 'Solicitar cita', route: '/solicitar-cita' },
          { label: 'Mis citas', route: '/ciudadano/mis-citas' },
        ];
      default:
        return [
          { label: 'Inicio', route: '/' },
        ];
    }
  });

  constructor() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.mobileMenuOpen.set(false));
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  logout(): void {
    this.auth.logout();
  }
}