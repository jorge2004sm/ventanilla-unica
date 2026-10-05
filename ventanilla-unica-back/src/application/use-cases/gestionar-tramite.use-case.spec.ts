import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GestionarTramiteUseCase } from './gestionar-tramite.use-case';
import { EstadoTramite } from 'src/domain/enums/estado-tramite.enum';

describe('GestionarTramiteUseCase', () => {
  let useCase: GestionarTramiteUseCase;

  const mockTramiteRepo = {
    findById: jest.fn(),
    findByCita: jest.fn(),
    update: jest.fn(),
  };

  const mockDocumentoRepo = {
    create: jest.fn(),
    findByTramite: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GestionarTramiteUseCase,
        { provide: 'ITramiteRepository', useValue: mockTramiteRepo },
        { provide: 'IDocumentoRepository', useValue: mockDocumentoRepo },
      ],
    }).compile();

    useCase = module.get(GestionarTramiteUseCase);
    jest.clearAllMocks();
  });

  describe('actualizarEstado', () => {
    it('debe lanzar NotFoundException si el trámite no existe', async () => {
      mockTramiteRepo.findById.mockResolvedValue(null);
      await expect(
        useCase.actualizarEstado(999, { estado: EstadoTramite.EN_PROCESO } as any, 1, 'empleado'),
      ).rejects.toThrow(NotFoundException);
    });

    it('debe permitir al empleado cambiar a estado en_proceso', async () => {
      mockTramiteRepo.findById.mockResolvedValue({ id: 1, estado: EstadoTramite.PENDIENTE });
      mockTramiteRepo.update.mockResolvedValue({ id: 1, estado: EstadoTramite.EN_PROCESO });

      const resultado = await useCase.actualizarEstado(1, { estado: EstadoTramite.EN_PROCESO } as any, 1, 'empleado');
      expect(resultado.estado).toBe(EstadoTramite.EN_PROCESO);
    });

    it('debe rechazar al ciudadano cambiar a estados no permitidos', async () => {
      mockTramiteRepo.findById.mockResolvedValue({ id: 1, estado: EstadoTramite.PENDIENTE });
      await expect(
        useCase.actualizarEstado(1, { estado: EstadoTramite.COMPLETADO } as any, 1, 'ciudadano'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('subirDocumento', () => {
    it('debe lanzar NotFoundException si el trámite no existe', async () => {
      mockTramiteRepo.findById.mockResolvedValue(null);
      await expect(
        useCase.subirDocumento({ tramite_id: 999, nombre_archivo: 'doc.pdf', ruta_archivo: '/uploads/doc.pdf' } as any, 1, 'empleado'),
      ).rejects.toThrow(NotFoundException);
    });

    it('debe subir documento si el trámite existe y el rol es válido', async () => {
      mockTramiteRepo.findById.mockResolvedValue({ id: 1 });
      mockDocumentoRepo.create.mockResolvedValue({ id: 1, nombre_archivo: 'doc.pdf' });

      const resultado = await useCase.subirDocumento(
        { tramite_id: 1, nombre_archivo: 'doc.pdf', ruta_archivo: '/uploads/doc.pdf' } as any, 1, 'empleado',
      );
      expect(resultado.nombre_archivo).toBe('doc.pdf');
    });
  });

  describe('obtenerPorId', () => {
    it('debe lanzar NotFoundException si no existe', async () => {
      mockTramiteRepo.findById.mockResolvedValue(null);
      await expect(useCase.obtenerPorId(999)).rejects.toThrow(NotFoundException);
    });

    it('debe devolver el trámite si existe', async () => {
      mockTramiteRepo.findById.mockResolvedValue({ id: 1, estado: EstadoTramite.PENDIENTE });
      const resultado = await useCase.obtenerPorId(1);
      expect(resultado.estado).toBe(EstadoTramite.PENDIENTE);
    });
  });
});