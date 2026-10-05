import { ForbiddenException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UpdateCitaDto } from "src/domain/dto/update-cita.dto";
import { Cita } from "src/domain/entities/cita.entity";
import { Rol } from "src/domain/enums/rol.enum";
import { ICitaRepository } from "src/domain/interfaces/i-cita.repository";

@Injectable()
export class GestionarCitaUseCase {
    constructor(
        @Inject('ICitaRepository') private readonly citaRepository: ICitaRepository
    ) { }


    async actualizarEstado(citaId: number, dto: UpdateCitaDto, usuarioId: number, rol: string): Promise<Cita> {
        const cita = await this.citaRepository.findById(citaId);
        if (!cita) {
            throw new NotFoundException('Cita no encontrada');
        }

        if (rol !== Rol.ADMIN && cita.empleado.id !== usuarioId) {
            throw new ForbiddenException('No tienes permiso para gestionar esta cita');
        }

        try {
            return await this.citaRepository.update(citaId, dto);
        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar la cita');
        }
    }

    async reasignarCita(citaId: number, nuevoEmpleadoId: number, rol: string): Promise<Cita> {

        if (rol !== Rol.ADMIN) {
            throw new ForbiddenException('No tienes permiso para reasignar esta cita');
        }
        const cita = await this.citaRepository.findById(citaId);
        if (!cita) {
            throw new NotFoundException('Cita no encontrada');
        }

        try {
            return await this.citaRepository.update(citaId, {
                empleado: { id: nuevoEmpleadoId } as any
            });
        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar la cita');
        }

    }

    async obtenerPorTenant(tenantId: number, limit?: number, offset?: number): Promise<Cita[]> {
        return this.citaRepository.findByTenant(tenantId, limit, offset);
    }

    async obtenerPorEmpleado(empleadoId: number, fecha?: string, limit?: number, offset?: number): Promise<Cita[]>{
        return this.citaRepository.findCitasByEmpleado(empleadoId, fecha, limit, offset);
    }

    async obtenerPorCiudadano(ciudadanoId: number, limit?: number, offset?: number): Promise<Cita[]> {
        return this.citaRepository.findByCiudadano(ciudadanoId, limit, offset)
    }

    async obtenerPorId(citaId: number): Promise<Cita> {
        const cita = await this.citaRepository.findById(citaId);
        if (!cita) {
            throw new NotFoundException('Cita no encontrada')
        }
        return cita;
    }

}