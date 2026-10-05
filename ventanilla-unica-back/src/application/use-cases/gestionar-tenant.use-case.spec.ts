import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GestionarTenantUseCase } from './gestionar-tenant.use-case';

describe('GestionarTenantUseCase', () => {
  let useCase: GestionarTenantUseCase;

  const mockTenantRepo = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    findByTipoTramite: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GestionarTenantUseCase,
        { provide: 'ITenantRepository', useValue: mockTenantRepo },
      ],
    }).compile();

    useCase = module.get(GestionarTenantUseCase);
    jest.clearAllMocks();
  });

  describe('crear', () => {
    it('debe rechazar si el rol no es superadmin', async () => {
      await expect(
        useCase.crear({ nombre: 'Ayuntamiento' } as any, 'admin'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debe crear tenant si es superadmin', async () => {
      mockTenantRepo.create.mockResolvedValue({ id: 1, nombre: 'Ayuntamiento' });
      const resultado = await useCase.crear({ nombre: 'Ayuntamiento' } as any, 'superadmin');
      expect(resultado.nombre).toBe('Ayuntamiento');
    });
  });

  describe('actualizar', () => {
    it('debe rechazar si el rol no es superadmin', async () => {
      await expect(
        useCase.actualizar(1, { nombre: 'Nuevo nombre' } as any, 'admin'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debe rechazar si el tenant no existe', async () => {
      mockTenantRepo.findById.mockResolvedValue(null);
      await expect(
        useCase.actualizar(999, { nombre: 'Nuevo' } as any, 'superadmin'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debe actualizar tenant si es superadmin y existe', async () => {
      mockTenantRepo.findById.mockResolvedValue({ id: 1 });
      mockTenantRepo.update.mockResolvedValue({ id: 1, nombre: 'Nuevo' });
      const resultado = await useCase.actualizar(1, { nombre: 'Nuevo' } as any, 'superadmin');
      expect(resultado.nombre).toBe('Nuevo');
    });
  });

  describe('desactivar', () => {
    it('debe rechazar si el rol no es superadmin', async () => {
      await expect(useCase.desactivar(1, 'admin')).rejects.toThrow(ForbiddenException);
    });

    it('debe rechazar si el tenant no existe', async () => {
      mockTenantRepo.findById.mockResolvedValue(null);
      await expect(useCase.desactivar(999, 'superadmin')).rejects.toThrow(ForbiddenException);
    });

    it('debe desactivar tenant si es superadmin y existe', async () => {
      mockTenantRepo.findById.mockResolvedValue({ id: 1 });
      mockTenantRepo.update.mockResolvedValue({ id: 1, activo: false });
      const resultado = await useCase.desactivar(1, 'superadmin');
      expect(resultado.activo).toBe(false);
    });
  });

  describe('obtenerPorId', () => {
    it('debe rechazar si el tenant no existe', async () => {
      mockTenantRepo.findById.mockResolvedValue(null);
      await expect(useCase.obtenerPorId(999)).rejects.toThrow(ForbiddenException);
    });

    it('debe devolver el tenant si existe', async () => {
      mockTenantRepo.findById.mockResolvedValue({ id: 1, nombre: 'Ayuntamiento' });
      const resultado = await useCase.obtenerPorId(1);
      expect(resultado.nombre).toBe('Ayuntamiento');
    });
  });
});