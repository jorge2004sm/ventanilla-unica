import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITenantRepository } from "src/domain/interfaces/i-tenant.repository";
import { TenantOrmEntity } from "../tenant.orm-entity";
import { Repository } from "typeorm";
import { Tenant } from "src/domain/entities/tenant.entity";

@Injectable()
export class TenantTypeOrmRepository implements ITenantRepository {

    constructor(@InjectRepository(TenantOrmEntity) private readonly repo: Repository<TenantOrmEntity>) { }


    /**
 * Busca todos los tenants.
 * Usado en: Listado de organizaciones para el ciudadano al solicitar cita.
 */
    async findAll(limit?: number, offset?: number): Promise<Tenant[]> {
        return this.repo.find({
            take: limit,
            skip: offset
        });
    }

    /**
 * Busca un tenant por ID.
 * Usado en: Detalle de organización.
 */
    async findById(id: number): Promise<Tenant | null> {
        return this.repo.findOne({ where: { id } });
    }

    /**
 * Busca tenants que ofrecen un tipo de trámite específico.
 * Usado en: Flujo solicitar cita, el ciudadano elige tipo de trámite
 * y ve qué organizaciones lo ofrecen.
 */
    async findByTipoTramite(tipoTramiteId: number, limit?: number, offset?: number): Promise<Tenant[]> {
        return this.repo.createQueryBuilder('tenant')
            .innerJoin('tipos_tramite', 'tipo', 'tipo.tenantId = tenant.id')
            .where('tipo.id = :tipoTramiteId', { tipoTramiteId })
            .take(limit)
            .skip(offset)
            .getMany();
    }

    async create(tenant: Partial<Tenant>): Promise<Tenant> {
        const entity = this.repo.create(tenant);
        return this.repo.save(entity);
    }

    async update(id: number, tenant: Partial<Tenant>): Promise<Tenant> {
        await this.repo.update(id, tenant);
        const updated = await this.findById(id);
        if (!updated) {
            throw new Error('Tenant no encontrado');
        }
        return updated;
        
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete(id);
    }
}
