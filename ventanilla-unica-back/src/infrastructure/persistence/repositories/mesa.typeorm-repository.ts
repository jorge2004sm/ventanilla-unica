import { Injectable } from "@nestjs/common";
import { IMesaRepository } from "src/domain/interfaces/i-mesa.repository";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { MesaOrmEntity } from "../mesa.orm-entity";
import { Mesa } from "src/domain/entities/mesa.entity";


@Injectable()
export class MesaTypeOrmRepository implements IMesaRepository {

    constructor(@InjectRepository(MesaOrmEntity) private readonly repo: Repository<MesaOrmEntity>) { }

    async findAll(limit?: number, offset?: number, ): Promise<Mesa[]> {
        return this.repo.find({
            take: limit,
            skip: offset
        });
    }

    async findById(id: number): Promise<Mesa | null> {
        return this.repo.findOne({ where: { id } });
    }
    
    /**
 * Busca mesas de una sala.
 * Usado en: Vista admin para ver los puestos disponibles en una sala.
 */
    async findBySala(salaId: number): Promise<Mesa[]> {
        return this.repo.find({
            where: { sala: { id: salaId } },
        });
    }

    async create(mesa: Partial<Mesa>): Promise<Mesa> {
        const entity = this.repo.create(mesa);
        return this.repo.save(entity);
    }

    async update(id: number, mesa: Partial<Mesa>): Promise<Mesa> {
        await this.repo.update(id, mesa);
        const updated = await this.findById(id);
        if (!updated) throw new Error('Mesa no encontrada');
        return updated;
    }   

    async delete(id: number): Promise<void> {
        await this.repo.delete(id);
    }
}