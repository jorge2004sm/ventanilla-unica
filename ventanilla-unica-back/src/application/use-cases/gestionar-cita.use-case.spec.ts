import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GestionarCitaUseCase } from './gestionar-cita.use-case';
import { EstadoCita } from 'src/domain/enums/estado-cita.enum';

describe('GestionarCitaUseCase', () => {
  let useCase: GestionarCitaUseCase;

  const mockCitaRepo = {
    findById: jest.fn(),
    findByTenant: jest.fn(),
    findCitasByEmpleado: jest.fn(),
    findByCiudadano: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GestionarCitaUseCase,
        { provide: 'ICitaRepository', useValue: mockCitaRepo },
      ],
    }).compile();

    useCase = module.get(GestionarCitaUseCase);
    jest.clearAllMocks();
  });

  // ---------- Actualizar estado ----------

  describe('actualizarEstado', () => {
    it('debe lanzar NotFoundException si la cita no existe', async () => {
      mockCitaRepo.findById.mockResolvedValue(null);

      await expect(
        useCase.actualizarEstado(999, { estado: EstadoCita.COMPLETADA }, 1, 'empleado'),
      ).rejects.toThrow(NotFoundException);
    });

    it('debe permitir al empleado asignado actualizar su cita', async () => {
      mockCitaRepo.findById.mockResolvedValue({ id: 1, empleado: { id: 5 } });
      mockCitaRepo.update.mockResolvedValue({ id: 1, estado: EstadoCita.COMPLETADA });

      const resultado = await useCase.actualizarEstado(1, { estado: EstadoCita.COMPLETADA }, 5, 'empleado');
      expect(resultado.estado).toBe(EstadoCita.COMPLETADA);
      expect(mockCitaRepo.update).toHaveBeenCalledWith(1, { estado: EstadoCita.COMPLETADA });
    });

    it('debe rechazar a un empleado que no es el asignado', async () => {
      mockCitaRepo.findById.mockResolvedValue({ id: 1, empleado: { id: 5 } });

      await expect(
        useCase.actualizarEstado(1, { estado: EstadoCita.COMPLETADA }, 99, 'empleado'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debe permitir al admin actualizar cualquier cita', async () => {
      mockCitaRepo.findById.mockResolvedValue({ id: 1, empleado: { id: 5 } });
      mockCitaRepo.update.mockResolvedValue({ id: 1, estado: EstadoCita.CANCELADA });

      const resultado = await useCase.actualizarEstado(1, { estado: EstadoCita.CANCELADA }, 99, 'admin');
      expect(resultado.estado).toBe(EstadoCita.CANCELADA);
    });
  });

  // ---------- Reasignar cita ----------

  describe('reasignarCita', () => {
    it('debe rechazar la reasignación si el rol no es admin', async () => {
      await expect(
        useCase.reasignarCita(1, 2, 'empleado'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debe lanzar NotFoundException si la cita no existe', async () => {
      mockCitaRepo.findById.mockResolvedValue(null);

      await expect(
        useCase.reasignarCita(999, 2, 'admin'),
      ).rejects.toThrow(NotFoundException);
    });

    it('debe permitir al admin reasignar una cita', async () => {
      mockCitaRepo.findById.mockResolvedValue({ id: 1, empleado: { id: 5 } });
      mockCitaRepo.update.mockResolvedValue({ id: 1, empleado: { id: 2 } });

      const resultado = await useCase.reasignarCita(1, 2, 'admin');
      expect(resultado.empleado.id).toBe(2);
    });
  });

  // ---------- Obtener por ID ----------

  describe('obtenerPorId', () => {
    it('debe lanzar NotFoundException si la cita no existe', async () => {
      mockCitaRepo.findById.mockResolvedValue(null);

      await expect(useCase.obtenerPorId(999)).rejects.toThrow(NotFoundException);
    });

    it('debe devolver la cita si existe', async () => {
      const citaMock = { id: 1, ciudadano_nombre: 'Juan' };
      mockCitaRepo.findById.mockResolvedValue(citaMock);

      const resultado = await useCase.obtenerPorId(1);
      expect(resultado).toEqual(citaMock);
    });
  });
});