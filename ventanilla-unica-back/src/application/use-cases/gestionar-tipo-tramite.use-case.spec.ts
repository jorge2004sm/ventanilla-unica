import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GestionarTipoTramiteUseCase } from './gestionar-tipo-tramite.use-case';

describe('GestionarTipoTramiteUseCase', () => {
  let useCase: GestionarTipoTramiteUseCase;

  const mockTipoTramiteRepo = {
    create: jest.fn(),
    findById: jest.fn(),
    findByTenant: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GestionarTipoTramiteUseCase,
        { provide: 'ITipoTramiteRepository', useValue: mockTipoTramiteRepo },
      ],
    }).compile();

    useCase = module.get(GestionarTipoTramiteUseCase);
    jest.clearAllMocks();
  });

  describe('crear', () => {
    it('debe rechazar si el rol no es admin', async () => {
      await expect(
        useCase.crear({ nombre: 'Renovación DNI', tenant_id: 1 } as any, 'empleado'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debe crear tipo de trámite si es admin', async () => {
      mockTipoTramiteRepo.create.mockResolvedValue({ id: 1, nombre: 'Renovación DNI' });
      const resultado = await useCase.crear({ nombre: 'Renovación DNI', tenant_id: 1 } as any, 'admin');
      expect(resultado.nombre).toBe('Renovación DNI');
    });
  });

  describe('actualizar', () => {
    it('debe rechazar si el rol no es admin', async () => {
      await expect(
        useCase.actualizar(1, { nombre: 'Nuevo' } as any, 'empleado'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      mockTipoTramiteRepo.findById.mockResolvedValue(null);
      await expect(
        useCase.actualizar(999, { nombre: 'Nuevo' } as any, 'admin'),
      ).rejects.toThrow(NotFoundException);
    });

    it('debe actualizar si es admin y existe', async () => {
      mockTipoTramiteRepo.findById.mockResolvedValue({ id: 1 });
      mockTipoTramiteRepo.update.mockResolvedValue({ id: 1, nombre: 'Nuevo' });
      const resultado = await useCase.actualizar(1, { nombre: 'Nuevo' } as any, 'admin');
      expect(resultado.nombre).toBe('Nuevo');
    });
  });

  describe('obtenerPorId', () => {
    it('debe lanzar NotFoundException si no existe', async () => {
      mockTipoTramiteRepo.findById.mockResolvedValue(null);
      await expect(useCase.obtenerPorId(999)).rejects.toThrow(NotFoundException);
    });

    it('debe devolver el tipo de trámite si existe', async () => {
      mockTipoTramiteRepo.findById.mockResolvedValue({ id: 1, nombre: 'DNI' });
      const resultado = await useCase.obtenerPorId(1);
      expect(resultado.nombre).toBe('DNI');
    });
  });
});