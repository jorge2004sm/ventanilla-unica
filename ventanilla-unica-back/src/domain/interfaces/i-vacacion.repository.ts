import { Vacacion } from "../entities/vacacion.entity";

export interface IVacacionRepository {
    findAll(limit?: number, offset?: number): Promise<Vacacion[]>;
    findById(id: number): Promise<Vacacion | null>;
    findByUsuario(usuarioId: number, limit?: number, offset?: number): Promise<Vacacion[]>;
    findByEstado(estado: string, limit?: number, offset?: number): Promise<Vacacion[]>;
    create(vacacion: Partial<Vacacion>): Promise<Vacacion>;
    update(id: number, vacacion: Partial<Vacacion>): Promise<Vacacion>;
    delete(id: number): Promise<void>;
}