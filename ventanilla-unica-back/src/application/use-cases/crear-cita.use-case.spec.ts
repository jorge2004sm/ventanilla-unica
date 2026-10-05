import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CrearCitaUseCase } from './crear-cita.use-case';
import { NotificacionService } from 'src/infrastructure/services/notificacion.service';

describe('CrearCitaUseCase', () => {
  let useCase: CrearCitaUseCase;

  const mockCitaRepo = {
    create: jest.fn(),
    findByFecha: jest.fn().mockResolvedValue([]),
  };

  const mockUsuarioRepo = {
    findDisponibles: jest.fn().mockResolvedValue([
      { id: 1, email: 'empleado@test.com' },
    ]),
  };

  const mockHorarioRepo = {
    findByFecha: jest.fn().mockResolvedValue(null),
    findBaseByTenant: jest.fn().mockResolvedValue([
      { dia_semana: 'lunes', hora_inicio: '09:00', hora_fin: '14:00', activo: true },
      { dia_semana: 'martes', hora_inicio: '09:00', hora_fin: '14:00', activo: true },
      { dia_semana: 'miercoles', hora_inicio: '09:00', hora_fin: '14:00', activo: true },
      { dia_semana: 'jueves', hora_inicio: '09:00', hora_fin: '14:00', activo: true },
      { dia_semana: 'viernes', hora_inicio: '09:00', hora_fin: '14:00', activo: true },
    ]),
  };

  const mockTramiteRepo = {
    create: jest.fn().mockResolvedValue({ id: 1 }),
  };

  const mockTipoTramiteRepo = {
    findById: jest.fn().mockResolvedValue({
      id: 1,
      nombre: 'Renovación DNI',
      requisitos_documentos: 'DNI anterior',
      tenant: { id: 1, nombre: 'Ayuntamiento', direccion: 'Plaza 1' },
    }),
  };

  const mockNotificacionService = {
    enviarConfirmacionCita: jest.fn().mockResolvedValue(undefined),
  };

  const dtoBase = {
    ciudadano_nombre: 'Juan',
    ciudadano_apellidos: 'García López',
    ciudadano_email: 'juan@test.com',
    ciudadano_dni: '12345678A',
    ciudadano_telefono: '612345678',
    hora_inicio: '10:00',
    hora_fin: '10:30',
    tenant_id: 1,
    tipo_tramite_id: 1,
    empleado_id: undefined,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrearCitaUseCase,
        { provide: 'ICitaRepository', useValue: mockCitaRepo },
        { provide: 'IUsuarioRepository', useValue: mockUsuarioRepo },
        { provide: 'IHorarioRepository', useValue: mockHorarioRepo },
        { provide: 'ITramiteRepository', useValue: mockTramiteRepo },
        { provide: 'ITipoTramiteRepository', useValue: mockTipoTramiteRepo },
        { provide: NotificacionService, useValue: mockNotificacionService },
      ],
    }).compile();

    useCase = module.get(CrearCitaUseCase);
    jest.clearAllMocks();
  });

  it('debe rechazar fechas pasadas', async () => {
    const dto = { ...dtoBase, fecha: '2020-01-01' };
    await expect(useCase.execute(dto)).rejects.toThrow(BadRequestException);
  });

  it('debe rechazar fechas con más de 7 días', async () => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 10);
    const dto = { ...dtoBase, fecha: fecha.toISOString().split('T')[0] };
    await expect(useCase.execute(dto)).rejects.toThrow(BadRequestException);
  });

  it('debe rechazar citas en días festivos', async () => {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    mockHorarioRepo.findByFecha.mockResolvedValueOnce({ es_festivo: true });
    const dto = { ...dtoBase, fecha: manana.toISOString().split('T')[0] };
    await expect(useCase.execute(dto)).rejects.toThrow('dias festivos');
  });

  it('debe rechazar si el tipo de trámite no existe', async () => {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    mockTipoTramiteRepo.findById.mockResolvedValueOnce(null);
    const dto = { ...dtoBase, fecha: manana.toISOString().split('T')[0] };
    await expect(useCase.execute(dto)).rejects.toThrow('Tipo de trámite no encontrado');
  });

  it('debe rechazar si no hay empleados disponibles', async () => {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    mockUsuarioRepo.findDisponibles.mockResolvedValueOnce([]);
    const dto = { ...dtoBase, fecha: manana.toISOString().split('T')[0] };
    await expect(useCase.execute(dto)).rejects.toThrow('No hay empleados disponibles');
  });

  it('debe rechazar si todos los empleados están ocupados a esa hora', async () => {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    mockUsuarioRepo.findDisponibles.mockResolvedValueOnce([{ id: 1, email: 'emp@test.com' }]);
    mockCitaRepo.findByFecha.mockResolvedValueOnce([
      { hora_inicio: '10:00', empleado: { id: 1 } },
    ]);
    const dto = { ...dtoBase, fecha: manana.toISOString().split('T')[0] };
    await expect(useCase.execute(dto)).rejects.toThrow('No hay huecos disponibles');
  });

  it('debe rechazar citas fuera del horario de atención', async () => {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    const dto = { ...dtoBase, fecha: manana.toISOString().split('T')[0], hora_inicio: '07:00', hora_fin: '07:30' };
    await expect(useCase.execute(dto)).rejects.toThrow('fuera del horario');
  });

  it('debe devolver las horas llenas cuando todos los empleados están ocupados', async () => {
    mockUsuarioRepo.findDisponibles.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    mockCitaRepo.findByFecha.mockResolvedValue([
      { hora_inicio: '10:00:00', empleado: { id: 1 } },
      { hora_inicio: '10:00:00', empleado: { id: 2 } },
      { hora_inicio: '11:00:00', empleado: { id: 1 } },
    ]);
    const resultado = await useCase.obtenerHorasOcupadas(1, '2026-05-05');
    expect(resultado).toContain('10:00');
    expect(resultado).not.toContain('11:00');
  });

  it('debe devolver array vacío si no hay citas', async () => {
    mockUsuarioRepo.findDisponibles.mockResolvedValue([{ id: 1 }]);
    mockCitaRepo.findByFecha.mockResolvedValue([]);
    const resultado = await useCase.obtenerHorasOcupadas(1, '2026-05-05');
    expect(resultado).toEqual([]);
  });
});