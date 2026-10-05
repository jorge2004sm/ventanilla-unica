import { BadRequestException, ForbiddenException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateVacacionDto } from "src/domain/dto/create-vacacion.dto";
import { Vacacion } from "src/domain/entities/vacacion.entity";
import { EstadoVacacion } from "src/domain/enums/estado-vacacion.enum";
import { Rol } from "src/domain/enums/rol.enum";
import { TipoVacacion } from "src/domain/enums/tipo-vacacion.enum";
import { ICitaRepository } from "src/domain/interfaces/i-cita.repository";
import { IVacacionRepository } from "src/domain/interfaces/i-vacacion.repository";

@Injectable()
export class GestionarVacacionUseCase {
    constructor(
        @Inject('IVacacionRepository') private readonly vacacionRepository: IVacacionRepository,
        @Inject('ICitaRepository') private readonly citaRepository: ICitaRepository
    ) { }

    async solicitar(dto: CreateVacacionDto): Promise<Vacacion> {
        const fechaInicio = new Date(dto.fecha_inicio);
        const hoy = new Date();

        if (dto.tipo === TipoVacacion.VACACIONES) {
            const diffDias = Math.ceil((fechaInicio.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

            if (diffDias < 14) {
                throw new BadRequestException('Las vacaciones deben solicitarse con al menos 14 días de anticipación');
            }
        }

        try {
            return this.vacacionRepository.create({
                ...dto,
                fecha_inicio: fechaInicio,
                fecha_fin: new Date(dto.fecha_fin),
                estado: EstadoVacacion.PENDIENTE,
                usuario: { id: dto.usuario_id } as any
            });
        } catch (error) {
            throw new InternalServerErrorException('Error al solicitar las vacaciones');
        }
    }

    async aprobarORechazar(vacacionId: number, estado: EstadoVacacion, adminId: number, rol: string): Promise<Vacacion> {

        if (rol !== Rol.ADMIN) {
            throw new ForbiddenException('Solo un admin puede aprobar o rechazar vacaciones');
        }

        const vacacion = await this.vacacionRepository.findById(vacacionId);

        if (!vacacion) {
            throw new NotFoundException('Vacación no encontrada');
        }

        if (vacacion.estado !== EstadoVacacion.PENDIENTE) {
            throw new BadRequestException('Solo se pueden gestionar vacaciones pendientes');
        }

        try {
            return await this.vacacionRepository.update(vacacionId, {
                estado,
                aprobadoPor: { id: adminId } as any,
            });
        } catch (error) {
            throw new InternalServerErrorException('Error al gestionar la vacación');
        }
    }

    async getCitasAfectadas(empleadoId: number, fechaInicio: Date, fechaFin: Date): Promise<any[]> {
        const todasCitas = await this.citaRepository.findCitasByEmpleado(empleadoId);

        const inicio = fechaInicio instanceof Date ? fechaInicio.toISOString().split('T')[0] : String(fechaInicio);
        const fin = fechaFin instanceof Date ? fechaFin.toISOString().split('T')[0] : String(fechaFin);

        return todasCitas.filter(cita => {
            const fechaCita = String(cita.fecha).split('T')[0];
            return fechaCita >= inicio && fechaCita <= fin && cita.estado === 'pendiente';
        });
    }

    async obtenerPorUsuario(usuarioId: number, limit?: number, offset?: number): Promise<Vacacion[]> {
        return this.vacacionRepository.findByUsuario(usuarioId, limit, offset);
    }

    async obtenerPendientes(limit?: number, offset?: number): Promise<Vacacion[]> {
        return this.vacacionRepository.findByEstado(EstadoVacacion.PENDIENTE, limit, offset);
    }

    async obtenerCitasAfectadas(vacacionId: number): Promise<any[]> {
        const vacacion = await this.vacacionRepository.findById(vacacionId);
        if (!vacacion) {
            throw new NotFoundException('Vacación no encontrada');
        }

        return this.getCitasAfectadas(
            vacacion.usuario.id,
            vacacion.fecha_inicio,
            vacacion.fecha_fin
        );
    }
}