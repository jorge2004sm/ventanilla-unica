import { Usuario } from "../entities/usuario.entity";

export interface IUsuarioRepository {
    findAll(limit?: number, offset?: number): Promise<Usuario[]>;
    findById(id: number): Promise<Usuario | null>;
    findByEmail(email: string): Promise<Usuario | null>;
    findByTenant(tenantId: number, limit?: number, offset?: number): Promise<Usuario[]>;
    findDisponibles(tenantId: number): Promise<Usuario[]>;
    create(usuario: Partial<Usuario>): Promise<Usuario>;
    update(id: number, usuario: Partial<Usuario>): Promise<Usuario>;
    delete(id: number): Promise<void>;
}