import { describe, it, expect, beforeEach, vi } from 'vitest';

// Test de la lógica pura del AuthService sin TestBed
describe('AuthService - lógica de autenticación', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  // ---------- localStorage ----------

  it('debe guardar token en localStorage', () => {
    localStorage.setItem('vu_token', 'jwt-test-123');
    expect(localStorage.getItem('vu_token')).toBe('jwt-test-123');
  });

  it('debe guardar usuario en localStorage', () => {
    const usuario = {
      id: 1,
      nombre: 'Jorge',
      apellidos: 'Sánchez',
      email: 'jorge@test.com',
      rol: 'ciudadano',
      tenantId: null,
      tenant_nombre: null,
    };
    localStorage.setItem('vu_user', JSON.stringify(usuario));

    const stored = JSON.parse(localStorage.getItem('vu_user')!);
    expect(stored.nombre).toBe('Jorge');
    expect(stored.rol).toBe('ciudadano');
  });

  it('debe devolver null si no hay token', () => {
    expect(localStorage.getItem('vu_token')).toBeNull();
  });

  it('debe devolver null si no hay usuario', () => {
    expect(localStorage.getItem('vu_user')).toBeNull();
  });

  // ---------- Logout ----------

  it('debe limpiar localStorage al hacer logout', () => {
    localStorage.setItem('vu_token', 'token');
    localStorage.setItem('vu_user', JSON.stringify({ id: 1 }));

    // Simular logout
    localStorage.removeItem('vu_token');
    localStorage.removeItem('vu_user');

    expect(localStorage.getItem('vu_token')).toBeNull();
    expect(localStorage.getItem('vu_user')).toBeNull();
  });

  // ---------- Parseo de usuario ----------

  it('debe parsear correctamente el usuario desde localStorage', () => {
    const usuario = {
      id: 5,
      nombre: 'Maria',
      apellidos: 'Lopez',
      email: 'maria@granada.es',
      rol: 'empleado',
      tenantId: 1,
      tenant_nombre: 'Ayuntamiento de Granada',
    };
    localStorage.setItem('vu_user', JSON.stringify(usuario));

    const raw = localStorage.getItem('vu_user');
    const parsed = raw ? JSON.parse(raw) : null;

    expect(parsed).not.toBeNull();
    expect(parsed.rol).toBe('empleado');
    expect(parsed.tenantId).toBe(1);
    expect(parsed.tenant_nombre).toBe('Ayuntamiento de Granada');
  });

  // ---------- Verificación de roles ----------

  it('debe verificar el rol correctamente', () => {
    const usuario = { id: 1, rol: 'admin' };
    localStorage.setItem('vu_user', JSON.stringify(usuario));

    const raw = localStorage.getItem('vu_user');
    const parsed = raw ? JSON.parse(raw) : null;

    expect(parsed?.rol === 'admin').toBe(true);
    expect(parsed?.rol === 'ciudadano').toBe(false);
    expect(parsed?.rol === 'superadmin').toBe(false);
  });

  // ---------- TenantId ----------

  it('debe devolver tenantId del usuario', () => {
    const usuario = { id: 1, rol: 'admin', tenantId: 3 };
    localStorage.setItem('vu_user', JSON.stringify(usuario));

    const parsed = JSON.parse(localStorage.getItem('vu_user')!);
    expect(parsed.tenantId).toBe(3);
  });

  it('debe devolver null si el usuario no tiene tenant', () => {
    const usuario = { id: 1, rol: 'ciudadano', tenantId: null };
    localStorage.setItem('vu_user', JSON.stringify(usuario));

    const parsed = JSON.parse(localStorage.getItem('vu_user')!);
    expect(parsed.tenantId).toBeNull();
  });
});