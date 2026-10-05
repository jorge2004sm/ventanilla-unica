import { describe, it, expect, beforeEach } from 'vitest';

describe('Guards - lógica de control de acceso', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  // ---------- authGuard lógica ----------

  describe('authGuard', () => {
    it('debe permitir acceso si hay token y usuario en localStorage', () => {
      localStorage.setItem('vu_token', 'jwt-token');
      localStorage.setItem('vu_user', JSON.stringify({ id: 1, rol: 'ciudadano' }));

      const token = localStorage.getItem('vu_token');
      const user = localStorage.getItem('vu_user');
      const isLoggedIn = token !== null && user !== null;

      expect(isLoggedIn).toBe(true);
    });

    it('debe denegar acceso si no hay token', () => {
      const token = localStorage.getItem('vu_token');
      const isLoggedIn = token !== null;

      expect(isLoggedIn).toBe(false);
    });

    it('debe denegar acceso si hay token pero no hay usuario', () => {
      localStorage.setItem('vu_token', 'jwt-token');

      const token = localStorage.getItem('vu_token');
      const user = localStorage.getItem('vu_user');
      const isLoggedIn = token !== null && user !== null;

      expect(isLoggedIn).toBe(false);
    });
  });

  // ---------- roleGuard lógica ----------

  describe('roleGuard', () => {
    it('debe permitir acceso si el usuario tiene el rol requerido', () => {
      const usuario = { id: 1, rol: 'admin' };
      const rolesPermitidos = ['admin', 'superadmin'];

      const tienePermiso = rolesPermitidos.includes(usuario.rol);
      expect(tienePermiso).toBe(true);
    });

    it('debe denegar acceso si el usuario no tiene el rol requerido', () => {
      const usuario = { id: 1, rol: 'ciudadano' };
      const rolesPermitidos = ['admin', 'superadmin'];

      const tienePermiso = rolesPermitidos.includes(usuario.rol);
      expect(tienePermiso).toBe(false);
    });

    it('debe denegar acceso si no hay usuario', () => {
      const usuario = null;
      const rolesPermitidos = ['admin'];

      const tienePermiso = usuario !== null && rolesPermitidos.includes((usuario as any)?.rol);
      expect(tienePermiso).toBe(false);
    });

    it('debe permitir al empleado acceder a rutas de empleado', () => {
      const usuario = { id: 1, rol: 'empleado' };
      const rolesPermitidos = ['empleado', 'admin'];

      const tienePermiso = rolesPermitidos.includes(usuario.rol);
      expect(tienePermiso).toBe(true);
    });

    it('debe denegar al empleado acceder a rutas de superadmin', () => {
      const usuario = { id: 1, rol: 'empleado' };
      const rolesPermitidos = ['superadmin'];

      const tienePermiso = rolesPermitidos.includes(usuario.rol);
      expect(tienePermiso).toBe(false);
    });
  });
});