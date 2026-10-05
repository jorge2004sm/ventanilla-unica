import { Cita } from "../entities/cita.entity";

export interface ICitaRepository {
    findAll(limit?: number, offset?: number): Promise<Cita[]>;
    findById(id: number): Promise<Cita | null>;
    findCitasByEmpleado(empleadoId: number, fecha?: string, limit?: number, offset?: number, order?: 'ASC' | 'DESC'): Promise<Cita[]>;
    findByFecha(fecha: string, tenantId: number): Promise<Cita[]>;
    findByTenant(tenantId: number, limit?: number, offset?: number): Promise<Cita[]>;
    findByCiudadano(ciudadanoId: number, limit?: number, offset?: number): Promise<Cita[]>;
    create(cita: Partial<Cita>): Promise<Cita>;
    update(id: number, cita: Partial<Cita>): Promise<Cita>;
    delete(id: number): Promise<void>;
}