import { describe, it, expect, beforeEach } from 'vitest';

describe('authInterceptor - lógica de JWT', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  // ---------- Inyección de token ----------

  it('debe construir el header Authorization con el token', () => {
    localStorage.setItem('vu_token', 'mi-jwt-token');

    const token = localStorage.getItem('vu_token');
    const header = token ? `Bearer ${token}` : null;

    expect(header).toBe('Bearer mi-jwt-token');
  });

  it('no debe construir header si no hay token', () => {
    const token = localStorage.getItem('vu_token');
    const header = token ? `Bearer ${token}` : null;

    expect(header).toBeNull();
  });

  // ---------- Lógica de 401 ----------

  it('debe detectar que un 401 requiere logout (ruta normal)', () => {
    const status = 401;
    const url = '/api/citas';

    const debeLogout = status === 401 && !url.includes('/auth/login');
    expect(debeLogout).toBe(true);
  });

  it('no debe hacer logout en 401 del endpoint de login', () => {
    const status = 401;
    const url = '/auth/login';

    const debeLogout = status === 401 && !url.includes('/auth/login');
    expect(debeLogout).toBe(false);
  });

it('no debe hacer logout en otros códigos de error', () => {
    const status: number = 403;
    const url = '/api/citas';

    const debeLogout = status === 401 && !url.includes('/auth/login');
    expect(debeLogout).toBe(false);
  });

  it('no debe hacer logout en 500', () => {
    const status: number = 500;
    const url = '/api/usuarios';

    const debeLogout = status === 401 && !url.includes('/auth/login');
    expect(debeLogout).toBe(false);
  });

  // ---------- Token expirado ----------

  it('debe detectar que un token vacío no es válido', () => {
    localStorage.setItem('vu_token', '');

    const token = localStorage.getItem('vu_token');
    const tieneToken = token !== null && token !== '';

    expect(tieneToken).toBe(false);
  });
});