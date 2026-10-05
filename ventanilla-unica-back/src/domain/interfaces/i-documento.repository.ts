import { Documento } from "../entities/documento.entity";

export interface IDocumentoRepository {

    findAll(limit?: number, offset?: number): Promise<Documento[]>;
    findById(id: number): Promise<Documento | null>;
    findByTramite(tramiteId: number): Promise<Documento[]>;
    create(documento: Partial<Documento>): Promise<Documento>;
    update(id: number, documento: Partial<Documento>): Promise<Documento>;
    delete(id: number): Promise<void>;
}