import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Vacacion } from "src/domain/entities/vacacion.entity";
import { IVacacionRepository } from "src/domain/interfaces/i-vacacion.repository";
import { Repository } from "typeorm";
import { VacacionOrmEntity } from "../vacacion.orm-entity";


@Injectable()
export class VacacionTypeOrmRepository implements IVacacionRepository {
    constructor(@InjectRepository(VacacionOrmEntity) private readonly repo: Repository<VacacionOrmEntity>) { }

    async findAll(limit?: number, offset?: number): Promise<Vacacion[]> {
        return this.repo.find({
            relations: ['usuario', 'aprobadoPor'],
            take: limit,
            skip: offset
        });
    }

    async findById(id: number): Promise<Vacacion | null> {
        return this.repo.findOne({ where: { id }, relations: ['usuario', 'aprobadoPor'] });
    }

    /**
 * Busca vacaciones de un usuario.
 * Usado en: Historial de vacaciones del empleado.
 * Relations: usuario (datos del solicitante), aprobadoPor (quién la gestionó).
 * Ordenado por fecha descendente (más recientes primero).
 */
    async findByUsuario(usuarioId: number, limit?: number, offset?: number): Promise<Vacacion[]> {
        return this.repo.find({
            where: { usuario: { id: usuarioId } },
            relations: ['usuario', 'aprobadoPor'],
            take: limit,
            skip: offset,
            order: { fecha_inicio: 'DESC' }
        });
    }

    /**
 * Busca vacaciones por estado.
 * Usado en: Vista admin para ver solicitudes pendientes de aprobar.
 * Ordenado por fecha ascendente (las más urgentes primero).
 */
    async findByEstado(estado: string, limit?: number, offset?: number): Promise<Vacacion[]> {
        return this.repo.find({
            where: { estado: estado as any },
            relations: ['usuario', 'aprobadoPor'],
            take: limit,
            skip: offset,
            order: { fecha_inicio: 'ASC' }
        });
    }

    async create(vacacion: Partial<Vacacion>): Promise<Vacacion> {
        const entity = this.repo.create(vacacion);
        return this.repo.save(entity);
    }

    async update(id: number, vacacion: Partial<Vacacion>): Promise<Vacacion> {  
        await this.repo.update(id, vacacion);
        const updated = await this.findById(id);
        if (!updated) throw new Error('Vacacion no encontrada');
        return updated;
    }   

    async delete(id: number): Promise<void> {
        await this.repo.delete(id);
    }
}