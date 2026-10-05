import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GestionarVacacionUseCase } from './gestionar-vacacion.use-case';
import { TipoVacacion } from 'src/domain/enums/tipo-vacacion.enum';
import { EstadoVacacion } from 'src/domain/enums/estado-vacacion.enum';

describe('GestionarVacacionUseCase', () => {
  let useCase: GestionarVacacionUseCase;

  const mockVacacionRepo = {
    create: jest.fn(),
    findById: jest.fn(),
    findByUsuario: jest.fn(),
    findByEstado: jest.fn(),
    update: jest.fn(),
  };

  const mockCitaRepo = {
    findCitasByEmpleado: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GestionarVacacionUseCase,
        { provide: 'IVacacionRepository', useValue: mockVacacionRepo },
        { provide: 'ICitaRepository', useValue: mockCitaRepo },
      ],
    }).compile();

    useCase = module.get(GestionarVacacionUseCase);
    jest.clearAllMocks();
  });

  // ---------- Solicitar vacaciones ----------

  describe('solicitar', () => {
    it('debe rechazar vacaciones con menos de 14 días de anticipación', async () => {
      const manana = new Date();
      manana.setDate(manana.getDate() + 3);

      const dto = {
        fecha_inicio: manana.toISOString().split('T')[0],
        fecha_fin: manana.toISOString().split('T')[0],
        tipo: TipoVacacion.VACACIONES,
        usuario_id: 1,
      };

      await expect(useCase.solicitar(dto)).rejects.toThrow(BadRequestException);
      await expect(useCase.solicitar(dto)).rejects.toThrow('14 días');
    });

    it('debe permitir vacaciones con más de 14 días de anticipación', async () => {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() + 20);
      const fechaStr = fecha.toISOString().split('T')[0];

      mockVacacionRepo.create.mockResolvedValue({ id: 1, estado: EstadoVacacion.PENDIENTE });

      const dto = {
        fecha_inicio: fechaStr,
        fecha_fin: fechaStr,
        tipo: TipoVacacion.VACACIONES,
        usuario_id: 1,
      };

      const resultado = await useCase.solicitar(dto);
      expect(resultado.estado).toBe(EstadoVacacion.PENDIENTE);
    });

    it('debe permitir baja médica sin restricción de 14 días', async () => {
      const manana = new Date();
      manana.setDate(manana.getDate() + 1);
      const fechaStr = manana.toISOString().split('T')[0];

      mockVacacionRepo.create.mockResolvedValue({ id: 1, estado: EstadoVacacion.PENDIENTE });

      const dto = {
        fecha_inicio: fechaStr,
        fecha_fin: fechaStr,
        tipo: TipoVacacion.BAJA_MEDICA,
        usuario_id: 1,
      };

      const resultado = await useCase.solicitar(dto);
      expect(resultado.estado).toBe(EstadoVacacion.PENDIENTE);
      expect(mockVacacionRepo.create).toHaveBeenCalled();
    });

    it('debe permitir asuntos propios sin restricción de 14 días', async () => {
      const manana = new Date();
      manana.setDate(manana.getDate() + 1);
      const fechaStr = manana.toISOString().split('T')[0];

      mockVacacionRepo.create.mockResolvedValue({ id: 1, estado: EstadoVacacion.PENDIENTE });

      const dto = {
        fecha_inicio: fechaStr,
        fecha_fin: fechaStr,
        tipo: TipoVacacion.ASUNTOS_PROPIOS,
        usuario_id: 1,
      };

      const resultado = await useCase.solicitar(dto);
      expect(resultado.estado).toBe(EstadoVacacion.PENDIENTE);
    });
  });

  // ---------- Aprobar o rechazar ----------

  describe('aprobarORechazar', () => {
    it('debe rechazar si el rol no es admin', async () => {
      await expect(
        useCase.aprobarORechazar(1, EstadoVacacion.APROBADA, 1, 'empleado'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debe lanzar NotFoundException si la vacación no existe', async () => {
      mockVacacionRepo.findById.mockResolvedValue(null);

      await expect(
        useCase.aprobarORechazar(999, EstadoVacacion.APROBADA, 1, 'admin'),
      ).rejects.toThrow(NotFoundException);
    });

    it('debe rechazar gestionar vacaciones que no estén pendientes', async () => {
      mockVacacionRepo.findById.mockResolvedValue({
        id: 1,
        estado: EstadoVacacion.APROBADA,
      });

      await expect(
        useCase.aprobarORechazar(1, EstadoVacacion.RECHAZADA, 1, 'admin'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        useCase.aprobarORechazar(1, EstadoVacacion.RECHAZADA, 1, 'admin'),
      ).rejects.toThrow('pendientes');
    });

    it('debe permitir al admin aprobar vacaciones pendientes', async () => {
      mockVacacionRepo.findById.mockResolvedValue({
        id: 1,
        estado: EstadoVacacion.PENDIENTE,
      });
      mockVacacionRepo.update.mockResolvedValue({
        id: 1,
        estado: EstadoVacacion.APROBADA,
      });

      const resultado = await useCase.aprobarORechazar(1, EstadoVacacion.APROBADA, 1, 'admin');
      expect(resultado.estado).toBe(EstadoVacacion.APROBADA);
    });
  });

  // ---------- Citas afectadas ----------

  describe('obtenerCitasAfectadas', () => {
    it('debe lanzar NotFoundException si la vacación no existe', async () => {
      mockVacacionRepo.findById.mockResolvedValue(null);

      await expect(useCase.obtenerCitasAfectadas(999)).rejects.toThrow(NotFoundException);
    });

    it('debe devolver solo las citas pendientes dentro del rango de fechas', async () => {
      mockVacacionRepo.findById.mockResolvedValue({
        id: 1,
        usuario: { id: 5 },
        fecha_inicio: new Date('2026-05-10'),
        fecha_fin: new Date('2026-05-12'),
      });

      mockCitaRepo.findCitasByEmpleado.mockResolvedValue([
        { id: 1, fecha: '2026-05-10T00:00:00.000Z', estado: 'pendiente' },
        { id: 2, fecha: '2026-05-11T00:00:00.000Z', estado: 'pendiente' },
        { id: 3, fecha: '2026-05-13T00:00:00.000Z', estado: 'pendiente' },  // fuera de rango
        { id: 4, fecha: '2026-05-10T00:00:00.000Z', estado: 'completada' }, // no pendiente
      ]);

      const resultado = await useCase.obtenerCitasAfectadas(1);
      expect(resultado).toHaveLength(2);
      expect(resultado.map((c: any) => c.id)).toEqual([1, 2]);
    });
  });
});