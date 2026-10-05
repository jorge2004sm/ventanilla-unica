import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IDocumentoRepository } from "src/domain/interfaces/i-documento.repository";
import { Repository } from "typeorm";
import { DocumentoOrmEntity } from "../documento.orm-entity";
import { Documento } from "src/domain/entities/documento.entity";

@Injectable()
export class DocumentoTypeOrmRepository implements IDocumentoRepository {
    constructor(@InjectRepository(DocumentoOrmEntity) private readonly repo: Repository<DocumentoOrmEntity>) { }

    async findAll(limit?: number, offset?: number): Promise<Documento[]> {
        return this.repo.find({
            take: limit,
            skip: offset
        });
    }

    async findById(id: number): Promise<Documento | null> {
        return this.repo.findOne({ where: { id } });
    }

    /**
 * Busca documentos de un trámite.
 * Usado en: Vista de trámite para empleado y ciudadano,
 * ver los archivos adjuntos al trámite.
 */
    async findByTramite(tramiteId: number): Promise<Documento[]> {
        return this.repo.find({
            where: { tramite: { id: tramiteId } },
        });
    }

    async create(documento: Partial<Documento>): Promise<Documento> {
        const entity = this.repo.create(documento);
        return this.repo.save(entity);
    }

    async update(id: number, documento: Partial<Documento>): Promise<Documento> {
        await this.repo.update(id, documento);
        const updated = await this.findById(id);
        if (!updated) throw new Error('Documento no encontrado');
        return updated;
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete(id);
    }
}