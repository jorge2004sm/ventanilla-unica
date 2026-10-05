import { Tenant } from '../entities/tenant.entity';

export interface ITenantRepository {

    findAll(limit?: number, offset?: number): Promise<Tenant[]>;
    findById(id: number): Promise<Tenant | null>;
    findByTipoTramite(tipoTramiteId: number, limit?: number, offset?: number): Promise<Tenant[]>;
    create(tenant: Partial<Tenant>): Promise<Tenant>;
    update(id: number, tenant: Partial<Tenant>): Promise<Tenant>;
    delete(id: number): Promise<void>;
}