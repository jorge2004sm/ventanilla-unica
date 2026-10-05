import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GestionarHorarioUseCase } from './gestionar-horario.use-case';

describe('GestionarHorarioUseCase', () => {
  let useCase: GestionarHorarioUseCase;

  const mockHorarioRepo = {
    create: jest.fn(),
    findById: jest.fn(),
    findByTenant: jest.fn(),
    findBaseByTenant: jest.fn(),
    findEspecialByTenant: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GestionarHorarioUseCase,
        { provide: 'IHorarioRepository', useValue: mockHorarioRepo },
      ],
    }).compile();

    useCase = module.get(GestionarHorarioUseCase);
    jest.clearAllMocks();
  });

  describe('crear', () => {
    it('debe rechazar si el rol no es admin', async () => {
      await expect(
        useCase.crear({ tipo: 'base', hora_inicio: '09:00', hora_fin: '14:00', tenant_id: 1, dia_semana: 'lunes' } as any, 'empleado'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debe rechazar horario base sin día de la semana', async () => {
      await expect(
        useCase.crear({ tipo: 'base', hora_inicio: '09:00', hora_fin: '14:00', tenant_id: 1 } as any, 'admin'),
      ).rejects.toThrow(BadRequestException);
    });

    it('debe rechazar si hora_inicio >= hora_fin', async () => {
      await expect(
        useCase.crear({ tipo: 'base', hora_inicio: '14:00', hora_fin: '09:00', dia_semana: 'lunes', tenant_id: 1 } as any, 'admin'),
      ).rejects.toThrow('hora de inicio debe ser menor');
    });

    it('debe crear horario base válido', async () => {
      mockHorarioRepo.create.mockResolvedValue({ id: 1, tipo: 'base', dia_semana: 'lunes' });

      const resultado = await useCase.crear(
        { tipo: 'base', hora_inicio: '09:00', hora_fin: '14:00', dia_semana: 'lunes', tenant_id: 1, duracion_cita: 30 } as any,
        'admin',
      );
      expect(resultado.tipo).toBe('base');
    });
  });

  describe('actualizar', () => {
    it('debe rechazar si el rol no es admin', async () => {
      await expect(
        useCase.actualizar(1, { hora_inicio: '10:00' } as any, 'empleado'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debe lanzar NotFoundException si el horario no existe', async () => {
      mockHorarioRepo.findById.mockResolvedValue(null);
      await expect(
        useCase.actualizar(999, { hora_inicio: '10:00' } as any, 'admin'),
      ).rejects.toThrow(NotFoundException);
    });

    it('debe rechazar si hora_inicio >= hora_fin en actualización', async () => {
      mockHorarioRepo.findById.mockResolvedValue({ id: 1 });
      await expect(
        useCase.actualizar(1, { hora_inicio: '15:00', hora_fin: '09:00' } as any, 'admin'),
      ).rejects.toThrow('hora de inicio debe ser menor');
    });
  });
});