import { TipoTramite } from "../entities/tipo-tramite.entity";

export interface ITipoTramiteRepository {
    findAll(limit?: number, offset?: number): Promise<TipoTramite[]>;
    findById(id: number): Promise<TipoTramite | null>;
    findByTenant(tenantId: number, limit?: number, offset?: number): Promise<TipoTramite[]>;
    create(tipoTramite: Partial<TipoTramite>): Promise<TipoTramite>;
    update(id: number, tipoTramite: Partial<TipoTramite>): Promise<TipoTramite>;
    delete(id: number): Promise<void>;
}