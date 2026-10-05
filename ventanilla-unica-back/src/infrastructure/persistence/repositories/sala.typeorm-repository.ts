import { Inject, Injectable } from "@nestjs/common";
import { ISalaRepository } from "src/domain/interfaces/i-sala.repository";
import { SalaOrmEntity } from "../sala.orm-entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Sala } from "src/domain/entities/sala.entity";

@Injectable()
export class SalaTypeOrmRepository implements ISalaRepository {

    constructor(@InjectRepository(SalaOrmEntity) private readonly repo: Repository<SalaOrmEntity>) { }

    async findAll(limit?: number, offset?: number): Promise<SalaOrmEntity[]> {
        return this.repo.find({
            take: limit,
            skip: offset
        });
    }

    async findById(id: number): Promise<Sala | null> {
        return this.repo.findOne({where: { id }});
    }

    /**
 * Busca vacaciones por estado.
 * Usado en: Vista admin para ver solicitudes pendientes de aprobar.
 * Ordenado por fecha ascendente (las más urgentes primero).
 */
    async findByTenant(tenantId: number, limit?: number, offset?: number): Promise<Sala[]> {
        return this.repo.find({
            where: { tenant: { id: tenantId } },
            take: limit,
            skip: offset,
        });
    }

    async create(sala: Partial<Sala>): Promise<Sala> {
        const entity = this.repo.create(sala);
        return this.repo.save(entity);
    }

    async update(id: number, sala: Partial<Sala>): Promise<Sala> {
        await this.repo.update(id, sala);
        const updated = await this.findById(id);
        if (!updated) throw new Error('Sala no encontrada');
        return updated;
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete(id);
    }
}