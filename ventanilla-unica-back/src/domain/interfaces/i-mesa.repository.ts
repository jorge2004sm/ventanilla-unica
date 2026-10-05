import { Mesa } from "../entities/mesa.entity";

export interface IMesaRepository {
    findAll(limit?: number, offset?: number): Promise<Mesa[]>;
    findById(id: number): Promise<Mesa | null>;
    findBySala(salaId: number): Promise<Mesa[]>;
    create(mesa: Partial<Mesa>): Promise<Mesa>;
    update(id: number, mesa: Partial<Mesa>): Promise<Mesa>;
    delete(id: number): Promise<void>;
}