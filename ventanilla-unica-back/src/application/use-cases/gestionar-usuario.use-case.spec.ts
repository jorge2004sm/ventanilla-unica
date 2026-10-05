import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GestionarUsuarioUseCase } from './gestionar-usuario.use-case';

describe('GestionarUsuarioUseCase', () => {
  let useCase: GestionarUsuarioUseCase;

  const mockUsuarioRepo = {
    create: jest.fn(),
    findById: jest.fn(),
    findByTenant: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
  };

  const mockRolRepo = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GestionarUsuarioUseCase,
        { provide: 'IUsuarioRepository', useValue: mockUsuarioRepo },
        { provide: 'IRolRepository', useValue: mockRolRepo },
      ],
    }).compile();

    useCase = module.get(GestionarUsuarioUseCase);
    jest.clearAllMocks();
  });

  describe('crear', () => {
    it('debe rechazar si el rol no es admin ni superadmin', async () => {
      await expect(
        useCase.crear({ nombre: 'Juan', email: 'juan@test.com', password: '123456', rol_id: 3, apellidos: 'García' } as any, 'empleado'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debe lanzar NotFoundException si el rol no existe', async () => {
      mockRolRepo.findById.mockResolvedValue(null);
      await expect(
        useCase.crear({ nombre: 'Juan', email: 'juan@test.com', password: '123456', rol_id: 999, apellidos: 'García' } as any, 'admin'),
      ).rejects.toThrow(NotFoundException);
    });

    it('debe crear usuario si es admin y el rol existe', async () => {
      mockRolRepo.findById.mockResolvedValue({ id: 3, nombre: 'empleado' });
      mockUsuarioRepo.create.mockResolvedValue({ id: 1, nombre: 'Juan', email: 'juan@test.com' });

      const resultado = await useCase.crear(
        { nombre: 'Juan', apellidos: 'García', email: 'juan@test.com', password: '123456', rol_id: 3 } as any,
        'admin',
      );
      expect(resultado.nombre).toBe('Juan');
      expect(mockUsuarioRepo.create).toHaveBeenCalled();
    });
  });

  describe('actualizar', () => {
    it('debe rechazar si el rol no es admin ni superadmin', async () => {
      await expect(
        useCase.actualizar(1, { nombre: 'Nuevo' } as any, 'empleado'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      mockUsuarioRepo.findById.mockResolvedValue(null);
      await expect(
        useCase.actualizar(999, { nombre: 'Nuevo' } as any, 'admin'),
      ).rejects.toThrow(NotFoundException);
    });

    it('debe actualizar usuario si es admin y existe', async () => {
      mockUsuarioRepo.findById.mockResolvedValue({ id: 1, nombre: 'Juan' });
      mockUsuarioRepo.update.mockResolvedValue({ id: 1, nombre: 'Nuevo' });

      const resultado = await useCase.actualizar(1, { nombre: 'Nuevo' } as any, 'admin');
      expect(resultado.nombre).toBe('Nuevo');
    });
  });

  describe('desactivar', () => {
    it('debe rechazar si el rol no es admin ni superadmin', async () => {
      await expect(useCase.desactivar(1, 'empleado')).rejects.toThrow(ForbiddenException);
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      mockUsuarioRepo.findById.mockResolvedValue(null);
      await expect(useCase.desactivar(999, 'admin')).rejects.toThrow(NotFoundException);
    });

    it('debe desactivar usuario si es admin y existe', async () => {
      mockUsuarioRepo.findById.mockResolvedValue({ id: 1, nombre: 'Juan' });
      mockUsuarioRepo.update.mockResolvedValue({ id: 1, activo: false });

      const resultado = await useCase.desactivar(1, 'admin');
      expect(resultado.activo).toBe(false);
    });
  });

  describe('obtenerPorId', () => {
    it('debe lanzar NotFoundException si no existe', async () => {
      mockUsuarioRepo.findById.mockResolvedValue(null);
      await expect(useCase.obtenerPorId(999)).rejects.toThrow(NotFoundException);
    });

    it('debe devolver el usuario si existe', async () => {
      mockUsuarioRepo.findById.mockResolvedValue({ id: 1, nombre: 'Juan' });
      const resultado = await useCase.obtenerPorId(1);
      expect(resultado.nombre).toBe('Juan');
    });
  });
});