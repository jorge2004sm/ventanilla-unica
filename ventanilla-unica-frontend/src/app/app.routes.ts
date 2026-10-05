import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Area pública
  {
    path: '',
    loadComponent: () =>
      import('./layouts/navbar-layout/navbar-layout.component').then((m) => m.NavbarLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/public/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/public/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'registro',
        loadComponent: () =>
          import('./features/public/registro/registro.component').then((m) => m.RegistroComponent),
      },
      {
        path: 'solicitar-cita',
        loadComponent: () =>
          import('./features/public/solicitar-cita/solicitar-cita.component').then((m) => m.SolicitarCitaComponent),
      },
      {
        path: 'cita/confirmacion/:id',
        loadComponent: () =>
          import('./features/public/confirmacion-cita/confirmacion-cita.component').then((m) => m.ConfirmacionCitaComponent),
      },

      // Area ciudadano
      {
        path: 'ciudadano',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ciudadano'] },
        children: [
          {
            path: 'mis-citas',
            loadComponent: () =>
              import('./features/ciudadano/mis-citas/mis-citas.component').then((m) => m.MisCitasComponent),
          },
          {
            path: 'citas/:id',
            loadComponent: () =>
              import('./features/ciudadano/detalle-cita/detalle-cita.component').then((m) => m.DetalleCitaComponent),
          },
          { path: '', redirectTo: 'mis-citas', pathMatch: 'full' },
        ],
      },

      // Area empleado 
      {
        path: 'empleado',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['empleado'] },
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./features/empleado/dashboard/dashboard.component').then((m) => m.EmpleadoDashboardComponent),
          },
          {
            path: 'citas/:id',
            loadComponent: () =>
              import('./features/empleado/gestionar-cita/gestionar-cita.component').then((m) => m.GestionarCitaComponent),
          },
          {
            path: 'mis-vacaciones',
            loadComponent: () =>
              import('./features/empleado/mis-vacaciones/mis-vacaciones.component').then((m) => m.MisVacacionesComponent),
          },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
      },
    ],
  },

  // Area staff
  {
    path: 'acceso',
    loadComponent: () =>
      import('./features/staff/login/staff-login.component').then((m) => m.StaffLoginComponent),
  },

  // Area admin
  {
    path: 'admin',
    loadComponent: () =>
      import('./layouts/sidebar-layout/sidebar-layout.component').then((m) => m.SidebarLayoutComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then((m) => m.AdminDashboardComponent),
      },
      {
        path: 'citas',
        loadComponent: () =>
          import('./features/admin/citas/admin-citas.component').then((m) => m.AdminCitasComponent),
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/admin/usuarios/admin-usuarios.component').then((m) => m.AdminUsuariosComponent),
      },
      {
        path: 'salas-mesas',
        loadComponent: () =>
          import('./features/admin/salas-mesas/admin-salas-mesas.component').then((m) => m.AdminSalasMesasComponent),
      },
      {
        path: 'horarios',
        loadComponent: () =>
          import('./features/admin/horarios/admin-horarios.component').then((m) => m.AdminHorariosComponent),
      },
      {
        path: 'tipos-tramite',
        loadComponent: () =>
          import('./features/admin/tipos-tramite/admin-tipos-tramite.component').then((m) => m.AdminTiposTramiteComponent),
      },
      {
        path: 'vacaciones',
        loadComponent: () =>
          import('./features/admin/vacaciones/admin-vacaciones.component').then((m) => m.AdminVacacionesComponent),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'citas/:id',
        loadComponent: () =>
          import('./features/admin/detalle-cita/admin-detalle-cita.component').then((m) => m.AdminDetalleCitaComponent),
      },
    ],
  },

  // Area superadmin
  {
  path: 'superadmin',
  loadComponent: () =>
    import('./layouts/sidebar-layout/sidebar-layout.component').then((m) => m.SidebarLayoutComponent),
  canActivate: [authGuard, roleGuard],
  data: { roles: ['superadmin'] },
  children: [
    {
      path: 'tenants',
      loadComponent: () =>
        import('./features/superadmin/tenants/tenants.component').then((m) => m.TenantsComponent),
    },
    {
      path: 'usuarios',
      loadComponent: () =>
        import('./features/superadmin/usuarios/superadmin-usuarios.component').then((m) => m.SuperadminUsuariosComponent),
    },
    { path: '', redirectTo: 'tenants', pathMatch: 'full' },
  ],
},

  // Redirigir a home
  { path: '**', redirectTo: '' },
];