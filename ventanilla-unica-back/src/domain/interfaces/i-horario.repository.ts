import { Horario } from "../entities/horario.entity";

export interface IHorarioRepository {
    findAll(limit?: number, offset?: number): Promise<Horario[]>;
    findById(id: number): Promise<Horario | null>;
    findByTenant(tenantId: number, activo?: boolean, limit?: number, offset?: number): Promise<Horario[]>;
    findBaseByTenant(tenantId: number): Promise<Horario[]>;
    findEspecialByTenant(tenantId: number): Promise<Horario[]>;
    findByFecha(fecha: Date, tenantId: number): Promise<Horario | null>;
    create(horario: Partial<Horario>): Promise<Horario>;
    update(id: number, horario: Partial<Horario>): Promise<Horario>;
    delete(id: number): Promise<void>;
}