import { ForbiddenException, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateMesaDto } from "src/domain/dto/create-mesa.dto";
import { CreateSalaDto } from "src/domain/dto/create-sala.dto";
import { UpdateMesaDto } from "src/domain/dto/update-mesa.dto";
import { UpdateSalaDto } from "src/domain/dto/update-sala.dto";
import { Mesa } from "src/domain/entities/mesa.entity";
import { Sala } from "src/domain/entities/sala.entity";
import { Rol } from "src/domain/enums/rol.enum";
import { IMesaRepository } from "src/domain/interfaces/i-mesa.repository";
import { ISalaRepository } from "src/domain/interfaces/i-sala.repository";

@Injectable()
export class GestionarSalaMesaUseCase{

    constructor(
        @Inject('ISalaRepository') private readonly salaRepository: ISalaRepository,
        @Inject('IMesaRepository') private readonly mesaRepository: IMesaRepository
    ) {}

    // SALAS

    async crearSala(dto: CreateSalaDto, rol: string): Promise<Sala> {
        if (rol !== Rol.ADMIN) {
            throw new ForbiddenException('Solo un admin puede crear salas');
        }

        try {
            return this.salaRepository.create({
                nombre: dto.nombre,
                descripcion: dto.descripcion,
                tenant: { id: dto.tenant_id } as any
            });
        } catch (error) {
            throw new InternalServerErrorException('Error al crear la sala');
        }
    }


    async actualizarSala(salaId: number, dto: UpdateSalaDto, rol: string): Promise<Sala> {
        if (rol !== Rol.ADMIN) {
            throw new ForbiddenException('Solo un admin puede modificar salas');
        }
        const sala = await this.salaRepository.findById(salaId);
        if (!sala) {
            throw new ForbiddenException('Sala no encontrada');
        }
        try {
            return this.salaRepository.update(salaId, dto);
        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar la sala');
        }
    }

    async obtenerSalasPorTenant(tenantId: number, limit?: number, offset?: number): Promise<Sala[]> {
        return this.salaRepository.findByTenant(tenantId, limit, offset);
    }

    // MESAS
    
    async crearMesa(dto: CreateMesaDto, rol: string): Promise<Mesa> {
        if (rol !== Rol.ADMIN) {
            throw new ForbiddenException('Solo un admin puede crear mesas');
        }

        const sala = await this.salaRepository.findById(dto.sala_id);
        if (!sala) {
            throw new ForbiddenException('Sala no encontrada');
        }

        try {
            return this.mesaRepository.create({
                numero: dto.numero,
                sala: { id: dto.sala_id } as any,
            });
        } catch (error) {
            throw new InternalServerErrorException('Error al crear la mesa');
        }

    }

    async actualizarMesa(mesaId: number, dto: UpdateMesaDto, rol: string): Promise<Mesa> {
        if (rol !== Rol.ADMIN) {
            throw new ForbiddenException('Solo un admin puede modificar mesas');
        }
        const mesa = await this.mesaRepository.findById(mesaId);
        if (!mesa) {
            throw new ForbiddenException('Mesa no encontrada');
        }
        try {
            return this.mesaRepository.update(mesaId, dto);
        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar la mesa');
        }
    }

    async obtenerMesasPorSala(salaId: number): Promise<Mesa[]> {
        return this.mesaRepository.findBySala(salaId);
    }
    
}