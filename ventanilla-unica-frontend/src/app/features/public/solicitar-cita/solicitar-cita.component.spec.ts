import { describe, it, expect } from 'vitest';

// Funciones extraídas del componente SolicitarCitaComponent para testear lógica pura

// Replica de calcularFecha del componente
function calcularFecha(diasDesdeHoy: number): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + diasDesdeHoy);
  return fecha.toISOString().split('T')[0];
}

// Replica de generarHorasDisponibles del componente
function generarSlots(horaInicio: string, horaFin: string, duracion: number): { hora_inicio: string; hora_fin: string }[] {
  const slots: { hora_inicio: string; hora_fin: string }[] = [];

  const horaInicioStr = horaInicio.slice(0, 5);
  const horaFinStr = horaFin.slice(0, 5);

  let [h, m] = horaInicioStr.split(':').map(Number);
  const [hFin, mFin] = horaFinStr.split(':').map(Number);
  const finEnMinutos = hFin * 60 + mFin;

  while (h * 60 + m + duracion <= finEnMinutos) {
    const inicio = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    const totalMin = h * 60 + m + duracion;
    const finH = Math.floor(totalMin / 60);
    const finM = totalMin % 60;
    const fin = `${String(finH).padStart(2, '0')}:${String(finM).padStart(2, '0')}`;

    slots.push({ hora_inicio: inicio, hora_fin: fin });

    m += duracion;
    if (m >= 60) {
      h += Math.floor(m / 60);
      m = m % 60;
    }
  }

  return slots;
}

// Replica de estaOcupada del componente
function estaOcupada(hora: string, horasOcupadas: string[]): boolean {
  return horasOcupadas.includes(hora);
}

// Replica de filtrar tipos de trámite únicos
function filtrarTiposTramiteUnicos(tipos: { nombre: string; activo?: boolean }[]): { nombre: string; activo?: boolean }[] {
  const vistos = new Set<string>();
  return tipos.filter((t) => {
    if (vistos.has(t.nombre)) return false;
    vistos.add(t.nombre);
    return true;
  });
}

// Replica de detección de festivos
function esFestivo(fecha: string, especiales: { es_festivo: boolean; fecha_inicio?: string; fecha_fin?: string }[]): boolean {
  return especiales.some(
    (h) => h.es_festivo && h.fecha_inicio && h.fecha_fin && fecha >= h.fecha_inicio && fecha <= h.fecha_fin
  );
}

// Obtener día de la semana como en el componente
function obtenerDiaSemana(fecha: string): string {
  const fechaDate = new Date(fecha);
  const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  return diasSemana[fechaDate.getUTCDay()];
}

// ===================== TESTS =====================

describe('SolicitarCita - cálculo de fechas', () => {
  it('debe devolver la fecha de hoy en formato YYYY-MM-DD', () => {
    const hoy = calcularFecha(0);
    const esperado = new Date().toISOString().split('T')[0];
    expect(hoy).toBe(esperado);
  });

  it('debe devolver la fecha de dentro de 7 días', () => {
    const maxima = calcularFecha(7);
    const esperada = new Date();
    esperada.setDate(esperada.getDate() + 7);
    expect(maxima).toBe(esperada.toISOString().split('T')[0]);
  });

  it('la fecha mínima debe ser menor que la máxima', () => {
    const minima = calcularFecha(0);
    const maxima = calcularFecha(7);
    expect(minima < maxima).toBe(true);
  });
});

describe('SolicitarCita - generación de slots horarios', () => {
  it('debe generar slots de 30 minutos entre 09:00 y 14:00', () => {
    const slots = generarSlots('09:00', '14:00', 30);
    expect(slots.length).toBe(10);
    expect(slots[0]).toEqual({ hora_inicio: '09:00', hora_fin: '09:30' });
    expect(slots[slots.length - 1]).toEqual({ hora_inicio: '13:30', hora_fin: '14:00' });
  });

  it('debe generar slots de 60 minutos entre 09:00 y 14:00', () => {
    const slots = generarSlots('09:00', '14:00', 60);
    expect(slots.length).toBe(5);
    expect(slots[0]).toEqual({ hora_inicio: '09:00', hora_fin: '10:00' });
  });

  it('debe generar slots de 15 minutos entre 10:00 y 11:00', () => {
    const slots = generarSlots('10:00', '11:00', 15);
    expect(slots.length).toBe(4);
  });

  it('debe manejar horarios con segundos (HH:mm:ss)', () => {
    const slots = generarSlots('09:00:00', '14:00:00', 30);
    expect(slots.length).toBe(10);
    expect(slots[0].hora_inicio).toBe('09:00');
  });

  it('debe devolver array vacío si la duración no cabe en el rango', () => {
    const slots = generarSlots('13:00', '13:20', 30);
    expect(slots.length).toBe(0);
  });

  it('debe devolver un solo slot si cabe justo', () => {
    const slots = generarSlots('13:00', '13:30', 30);
    expect(slots.length).toBe(1);
    expect(slots[0]).toEqual({ hora_inicio: '13:00', hora_fin: '13:30' });
  });
});

describe('SolicitarCita - horas ocupadas', () => {
  it('debe detectar hora ocupada', () => {
    expect(estaOcupada('10:00', ['09:00', '10:00', '11:00'])).toBe(true);
  });

  it('debe detectar hora no ocupada', () => {
    expect(estaOcupada('12:00', ['09:00', '10:00', '11:00'])).toBe(false);
  });

  it('debe funcionar con array vacío', () => {
    expect(estaOcupada('10:00', [])).toBe(false);
  });
});

describe('SolicitarCita - tipos de trámite únicos', () => {
  it('debe eliminar duplicados por nombre', () => {
    const tipos = [
      { nombre: 'Renovación DNI' },
      { nombre: 'Alta SS' },
      { nombre: 'Renovación DNI' },
      { nombre: 'Empadronamiento' },
    ];
    const unicos = filtrarTiposTramiteUnicos(tipos);
    expect(unicos.length).toBe(3);
    expect(unicos.map(t => t.nombre)).toEqual(['Renovación DNI', 'Alta SS', 'Empadronamiento']);
  });

  it('debe devolver todos si no hay duplicados', () => {
    const tipos = [
      { nombre: 'Renovación DNI' },
      { nombre: 'Alta SS' },
    ];
    const unicos = filtrarTiposTramiteUnicos(tipos);
    expect(unicos.length).toBe(2);
  });

  it('debe devolver array vacío si no hay tipos', () => {
    expect(filtrarTiposTramiteUnicos([]).length).toBe(0);
  });
});

describe('SolicitarCita - detección de festivos', () => {
  it('debe detectar un día festivo', () => {
    const especiales = [
      { es_festivo: true, fecha_inicio: '2026-05-01', fecha_fin: '2026-05-01' },
    ];
    expect(esFestivo('2026-05-01', especiales)).toBe(true);
  });

  it('debe no detectar festivo fuera de rango', () => {
    const especiales = [
      { es_festivo: true, fecha_inicio: '2026-05-01', fecha_fin: '2026-05-01' },
    ];
    expect(esFestivo('2026-05-02', especiales)).toBe(false);
  });

  it('debe ignorar especiales que no son festivos', () => {
    const especiales = [
      { es_festivo: false, fecha_inicio: '2026-05-01', fecha_fin: '2026-05-01' },
    ];
    expect(esFestivo('2026-05-01', especiales)).toBe(false);
  });

  it('debe detectar festivo en rango de varios días', () => {
    const especiales = [
      { es_festivo: true, fecha_inicio: '2026-12-24', fecha_fin: '2026-12-31' },
    ];
    expect(esFestivo('2026-12-25', especiales)).toBe(true);
    expect(esFestivo('2026-12-23', especiales)).toBe(false);
  });
});

describe('SolicitarCita - día de la semana', () => {
  it('debe devolver lunes para un lunes', () => {
    // 2026-05-04 es lunes
    expect(obtenerDiaSemana('2026-05-04')).toBe('lunes');
  });

  it('debe devolver miercoles sin tilde', () => {
    // 2026-05-06 es miércoles
    expect(obtenerDiaSemana('2026-05-06')).toBe('miercoles');
  });

  it('debe devolver sabado sin tilde', () => {
    // 2026-05-09 es sábado
    expect(obtenerDiaSemana('2026-05-09')).toBe('sabado');
  });

  it('debe devolver domingo', () => {
    // 2026-05-10 es domingo
    expect(obtenerDiaSemana('2026-05-10')).toBe('domingo');
  });
});