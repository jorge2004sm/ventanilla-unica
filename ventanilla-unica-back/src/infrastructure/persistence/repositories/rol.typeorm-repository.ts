import { IRolRepository } from "src/domain/interfaces/i-rol.repository";
import { RolOrmEntity } from "../rol.orm-entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Rol } from "src/domain/entities/rol.entity";

@Injectable()
export class RolTypeOrmRepository implements IRolRepository {

    constructor(@InjectRepository(RolOrmEntity) private readonly repo: Repository<RolOrmEntity>) { }


    async findAll(): Promise<Rol[]> {
        return this.repo.find();
    }

    async findById(id: number): Promise<Rol | null> {
        return this.repo.findOne({ where: { id } });
    }

    /**
 * Busca un rol por nombre.
 * Usado en: Registro ciudadano para asignar rol "ciudadano" automáticamente.
 */
    async findByName(nombre: string): Promise<Rol | null> {
        return this.repo.findOne({ where: { nombre } });
    }

}
