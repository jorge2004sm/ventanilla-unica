import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GestionarSalaMesaUseCase } from './gestionar-sala-mesa.use-case';

describe('GestionarSalaMesaUseCase', () => {
  let useCase: GestionarSalaMesaUseCase;

  const mockSalaRepo = {
    create: jest.fn(),
    findById: jest.fn(),
    findByTenant: jest.fn(),
    update: jest.fn(),
  };

  const mockMesaRepo = {
    create: jest.fn(),
    findById: jest.fn(),
    findBySala: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GestionarSalaMesaUseCase,
        { provide: 'ISalaRepository', useValue: mockSalaRepo },
        { provide: 'IMesaRepository', useValue: mockMesaRepo },
      ],
    }).compile();

    useCase = module.get(GestionarSalaMesaUseCase);
    jest.clearAllMocks();
  });

  describe('crearSala', () => {
    it('debe rechazar si el rol no es admin', async () => {
      await expect(
        useCase.crearSala({ nombre: 'Sala 1', tenant_id: 1 } as any, 'empleado'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debe crear sala si es admin', async () => {
      mockSalaRepo.create.mockResolvedValue({ id: 1, nombre: 'Sala 1' });
      const resultado = await useCase.crearSala({ nombre: 'Sala 1', tenant_id: 1 } as any, 'admin');
      expect(resultado.nombre).toBe('Sala 1');
    });
  });

  describe('actualizarSala', () => {
    it('debe rechazar si el rol no es admin', async () => {
      await expect(
        useCase.actualizarSala(1, { nombre: 'Sala 2' } as any, 'empleado'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debe rechazar si la sala no existe', async () => {
      mockSalaRepo.findById.mockResolvedValue(null);
      await expect(
        useCase.actualizarSala(999, { nombre: 'Sala 2' } as any, 'admin'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('crearMesa', () => {
    it('debe rechazar si el rol no es admin', async () => {
      await expect(
        useCase.crearMesa({ numero: 1, sala_id: 1 } as any, 'empleado'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debe rechazar si la sala no existe', async () => {
      mockSalaRepo.findById.mockResolvedValue(null);
      await expect(
        useCase.crearMesa({ numero: 1, sala_id: 999 } as any, 'admin'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debe crear mesa si es admin y la sala existe', async () => {
      mockSalaRepo.findById.mockResolvedValue({ id: 1 });
      mockMesaRepo.create.mockResolvedValue({ id: 1, numero: 1 });
      const resultado = await useCase.crearMesa({ numero: 1, sala_id: 1 } as any, 'admin');
      expect(resultado.numero).toBe(1);
    });
  });

  describe('actualizarMesa', () => {
    it('debe rechazar si el rol no es admin', async () => {
      await expect(
        useCase.actualizarMesa(1, { numero: 2 } as any, 'empleado'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debe rechazar si la mesa no existe', async () => {
      mockMesaRepo.findById.mockResolvedValue(null);
      await expect(
        useCase.actualizarMesa(999, { numero: 2 } as any, 'admin'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});