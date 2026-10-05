import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITipoTramiteRepository } from "src/domain/interfaces/i-tipo-tramite.repository";
import { Repository } from "typeorm";
import { TipoTramiteOrmEntity } from "../tipo-tramite.orm-entity";
import { TipoTramite } from "src/domain/entities/tipo-tramite.entity";

@Injectable()
export class TipoTramiteTypeOrmRepository implements ITipoTramiteRepository {
    constructor(@InjectRepository(TipoTramiteOrmEntity) private readonly repo: Repository<TipoTramiteOrmEntity>) { }

    async findAll(limit?: number, offset?: number): Promise<TipoTramite[]> {
        return this.repo.find({
            relations: ['tenant'],
            take: limit,
            skip: offset
        });
    }

    async findById(id: number): Promise<TipoTramite | null> {
        return this.repo.findOne({ where: { id }, relations: ['tenant'] });
    }

    /**
 * Busca tipos de trámite de un tenant.
 * Usado en: Vista admin para gestionar los trámites de su organización.
 */
    async findByTenant(tenantId: number, limit?: number, offset?: number): Promise<TipoTramite[]> {
        return this.repo.find({
            where: { tenant: { id: tenantId } },
            take: limit,
            skip: offset
        });
    }

    async create(tipoTramite: Partial<TipoTramite>): Promise<TipoTramite> {
        const entity = this.repo.create(tipoTramite);
        return this.repo.save(entity);
    }

    async update(id: number, tipoTramite: Partial<TipoTramite>): Promise<TipoTramite> {
        await this.repo.update(id, tipoTramite);
        const updated = await this.findById(id);
        if (!updated) throw new Error('Tipo de tramite no encontrado');
        return updated;
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete(id);
    }
}