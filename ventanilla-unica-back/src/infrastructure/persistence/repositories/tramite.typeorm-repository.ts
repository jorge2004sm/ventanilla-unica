import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITramiteRepository } from "src/domain/interfaces/i-tramite.repository";
import { In, Repository } from "typeorm";
import { TramiteOrmEntity } from "../tramite.orm-entity";
import { Tramite } from "src/domain/entities/tramite.entity";

@Injectable()
export class TramiteTypeOrmRepository implements ITramiteRepository {
    constructor(@InjectRepository(TramiteOrmEntity) private readonly repo: Repository<TramiteOrmEntity>) { }


    /**
 * Busca todos los trámites con sus relaciones.
 * Usado en: Vista admin para gestión general de trámites.
 * Relations: tipoTramite (qué tipo es), cita (datos de la cita asociada), documentos (adjuntos).
 */
    async findAll(limit?: number, offset?: number): Promise<Tramite[]> {
        return this.repo.find({
            relations: ['tipoTramite', 'cita', 'documentos'],
            take: limit,
            skip: offset
        });
    }

    /**
 * Busca un trámite por ID con todas sus relaciones.
 * Usado en: Detalle del trámite para empleado y ciudadano.
 */
    async findById(id: number): Promise<Tramite | null> {
        return this.repo.findOne({
            where: { id },
            relations: ['tipoTramite', 'cita', 'documentos']
        });
    }

    /**
 * Busca el trámite asociado a una cita.
 * Usado en: Cuando el empleado accede al trámite desde la vista de citas.
 * Relations: tipoTramite (requisitos), documentos (archivos adjuntos).
 */
    async findByCita(citaId: number): Promise<Tramite | null> {
        return this.repo.findOne({
            where: { cita: { id: citaId } },
            relations: ['tipoTramite', 'documentos'],
        });
    }

    /**
 * Busca trámites por estado.
 * Usado en: Filtrar trámites pendientes, en proceso, etc.
 */
    async findByEstado(estado: string, limit?: number, offset?: number): Promise<Tramite[]> {
        return this.repo.find({
            where: { estado: estado as any },
            relations: ['tipoTramite', 'cita', 'documentos'],
            take: limit,
            skip: offset
        });
    }

    async create(tramite: Partial<Tramite>): Promise<Tramite> {
        const entity = this.repo.create(tramite);
        return this.repo.save(entity);
    }

    async update(id: number, tramite: Partial<Tramite>): Promise<Tramite> {
        await this.repo.update(id, tramite);
        const updated = await this.findById(id);
        if (!updated) throw new Error('Tramite no encontrado');
        return updated;
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete(id);
    }
}