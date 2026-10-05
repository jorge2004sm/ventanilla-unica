import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sidebar-layout.component.html',
})
export class SidebarLayoutComponent {
  readonly auth = inject(AuthService);

  readonly adminSections: NavSection[] = [
    {
      title: 'General',
      items: [
        { label: 'Dashboard', route: '/admin/dashboard', icon: '📊' },
        { label: 'Citas', route: '/admin/citas', icon: '📅' },
        { label: 'Empleados', route: '/admin/usuarios', icon: '👥' },
      ],
    },
    {
      title: 'Configuración',
      items: [
        { label: 'Salas y mesas', route: '/admin/salas-mesas', icon: '🏢' },
        { label: 'Horarios', route: '/admin/horarios', icon: '🕒' },
        { label: 'Tipos de trámite', route: '/admin/tipos-tramite', icon: '📋' },
        { label: 'Vacaciones', route: '/admin/vacaciones', icon: '🏖️' },
      ],
    },
  ];

  readonly superadminSections: NavSection[] = [
    {
      title: 'Global',
      items: [
        { label: 'Tenants', route: '/superadmin/tenants', icon: '🏛️' },
        { label: 'Usuarios', route: '/superadmin/usuarios', icon: '👥' },
      ],
    },
  ];

  get sections(): NavSection[] {
    return this.auth.hasRole('superadmin') ? this.superadminSections : this.adminSections;
  }

  logout(): void {
    this.auth.logout();
  }
}