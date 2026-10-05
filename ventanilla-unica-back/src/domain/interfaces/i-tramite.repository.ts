import { Tramite } from "../entities/tramite.entity";

export interface ITramiteRepository {
    findAll(limit?: number, offset?: number): Promise<Tramite[]>;
    findById(id: number): Promise<Tramite | null>;
    findByCita(citaId: number): Promise<Tramite | null>;
    findByEstado(estado: string, limit?: number, offset?: number): Promise<Tramite[]>;
    create(tramite: Partial<Tramite>): Promise<Tramite>;
    update(id: number, tramite: Partial<Tramite>): Promise<Tramite>;
    delete(id: number): Promise<void>;
}