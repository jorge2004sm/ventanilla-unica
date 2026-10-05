import { Sala } from "../entities/sala.entity";

export interface ISalaRepository {

    findAll(limit?: number, offset?: number): Promise<Sala[]>;
    findById(id: number): Promise<Sala | null>;
    findByTenant(tenantId: number, limit?: number, offset?: number): Promise<Sala[]>;
    create(sala: Partial<Sala>): Promise<Sala>;
    update(id: number, sala: Partial<Sala>): Promise<Sala>;
    delete(id: number): Promise<void>;
}