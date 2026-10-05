import { BadRequestException, ForbiddenException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateHorarioDto } from "src/domain/dto/create-horario.dto";
import { UpdateHorarioDto } from "src/domain/dto/update-horario.dto";
import { Horario } from "src/domain/entities/horario.entity";
import { Rol } from "src/domain/enums/rol.enum";
import { TipoHorario } from "src/domain/enums/tipo-horario.enum";
import { IHorarioRepository } from "src/domain/interfaces/i-horario.repository";

@Injectable()
export class GestionarHorarioUseCase {
    constructor(@Inject('IHorarioRepository') private readonly horarioRepository: IHorarioRepository) { }

    async crear(dto: CreateHorarioDto, rol: string): Promise<Horario> {
        if (rol !== Rol.ADMIN) {
            throw new ForbiddenException('Solo un admin puede crear horarios');
        }

        if (dto.tipo === TipoHorario.BASE) {
            if (!dto.dia_semana) {
                throw new BadRequestException('El día de la semana es obligatorio para horarios base');
            }
        }

        if (dto.hora_inicio >= dto.hora_fin) {
            throw new BadRequestException('La hora de inicio debe ser menor que la hora de fin');
        }

        try {
            return this.horarioRepository.create({
                ...dto,
                fecha_inicio: dto.fecha_inicio ? new Date(dto.fecha_inicio) : undefined,
                fecha_fin: dto.fecha_fin ? new Date(dto.fecha_fin) : undefined,
                tenant: { id: dto.tenant_id } as any
            });
        } catch (error) {
            throw new InternalServerErrorException('Error al crear la cita');
        }
    }

    async actualizar(horarioId: number, dto: UpdateHorarioDto, rol: string): Promise<Horario> {
        if (rol !== Rol.ADMIN) {
            throw new ForbiddenException('Solo un admin puede actualizar horarios');
        }

        const horario = await this.horarioRepository.findById(horarioId);

        if (!horario) {
            throw new NotFoundException('Horario no encontrado');
        }

        if (dto.hora_inicio && dto.hora_fin && dto.hora_inicio >= dto.hora_fin) {
            throw new BadRequestException('La hora de inicio debe ser menor que la hora de fin');
        }

        try {
            return this.horarioRepository.update(horarioId, {
                ...dto,
                fecha_inicio: dto.fecha_inicio ? new Date(dto.fecha_inicio) : undefined,
                fecha_fin: dto.fecha_fin ? new Date(dto.fecha_fin) : undefined,
            });
        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar el horario');
        }

    }

    async obtenerPorTenant(tenantId: number, activo?: boolean, limit?: number, offset?: number): Promise<Horario[]> {
        return this.horarioRepository.findByTenant(tenantId, activo, limit, offset);
    }

    async obtenerBaseByTenant(tenantId: number): Promise<Horario[]> {
        return this.horarioRepository.findBaseByTenant(tenantId);
    }

    async obtenerEspecialByTenant(tenantId: number): Promise<Horario[]> {
        return this.horarioRepository.findEspecialByTenant(tenantId);
    }
}
