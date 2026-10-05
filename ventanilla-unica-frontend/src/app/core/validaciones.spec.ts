import { describe, it, expect } from 'vitest';

// Validaciones extraídas de los formularios del frontend

// Validación de DNI español (8 dígitos + 1 letra)
function validarDNI(dni: string): boolean {
  return /^[0-9]{8}[A-Za-z]$/.test(dni);
}

// Validación de teléfono 
function validarTelefono(telefono: string): boolean {
  return /^[67][0-9]{8}$/.test(telefono);
}

// Validación de email básica
function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validación de passwords match (registro)
function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}

// ===================== TESTS =====================

describe('Validación de DNI', () => {
  it('debe aceptar DNI válido: 12345678A', () => {
    expect(validarDNI('12345678A')).toBe(true);
  });

  it('debe aceptar DNI con letra minúscula: 12345678a', () => {
    expect(validarDNI('12345678a')).toBe(true);
  });

  it('debe rechazar DNI sin letra', () => {
    expect(validarDNI('12345678')).toBe(false);
  });

  it('debe rechazar DNI con menos de 8 dígitos', () => {
    expect(validarDNI('1234567A')).toBe(false);
  });

  it('debe rechazar DNI con más de 8 dígitos', () => {
    expect(validarDNI('123456789A')).toBe(false);
  });

  it('debe rechazar DNI con letras en los dígitos', () => {
    expect(validarDNI('1234ABCDA')).toBe(false);
  });

  it('debe rechazar cadena vacía', () => {
    expect(validarDNI('')).toBe(false);
  });
});

describe('Validación de teléfono', () => {
  it('debe aceptar teléfono que empieza por 6', () => {
    expect(validarTelefono('612345678')).toBe(true);
  });

  it('debe aceptar teléfono que empieza por 7', () => {
    expect(validarTelefono('712345678')).toBe(true);
  });

  it('debe rechazar teléfono que empieza por 9', () => {
    expect(validarTelefono('912345678')).toBe(false);
  });

  it('debe rechazar teléfono con menos de 9 dígitos', () => {
    expect(validarTelefono('61234567')).toBe(false);
  });

  it('debe rechazar teléfono con más de 9 dígitos', () => {
    expect(validarTelefono('6123456789')).toBe(false);
  });

  it('debe rechazar teléfono con letras', () => {
    expect(validarTelefono('61234abcd')).toBe(false);
  });

  it('debe rechazar cadena vacía', () => {
    expect(validarTelefono('')).toBe(false);
  });
});

describe('Validación de email', () => {
  it('debe aceptar email válido', () => {
    expect(validarEmail('jorge@test.com')).toBe(true);
  });

  it('debe aceptar email con subdominio', () => {
    expect(validarEmail('jorge@mail.test.com')).toBe(true);
  });

  it('debe rechazar email sin @', () => {
    expect(validarEmail('jorgetest.com')).toBe(false);
  });

  it('debe rechazar email sin dominio', () => {
    expect(validarEmail('jorge@')).toBe(false);
  });

  it('debe rechazar cadena vacía', () => {
    expect(validarEmail('')).toBe(false);
  });
});

describe('Validación de passwords match', () => {
  it('debe aceptar passwords iguales', () => {
    expect(passwordsMatch('MiPassword123', 'MiPassword123')).toBe(true);
  });

  it('debe rechazar passwords diferentes', () => {
    expect(passwordsMatch('MiPassword123', 'OtraPassword456')).toBe(false);
  });

  it('debe rechazar passwords con diferente case', () => {
    expect(passwordsMatch('password', 'Password')).toBe(false);
  });

  it('debe rechazar si una está vacía', () => {
    expect(passwordsMatch('MiPassword123', '')).toBe(false);
  });
});