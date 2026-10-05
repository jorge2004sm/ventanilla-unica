import { Rol } from "../entities/rol.entity";

export interface IRolRepository {
    findAll(): Promise<Rol[]>;
    findById(id: number): Promise<Rol | null>;
    findByName(nombre: string): Promise<Rol | null>;

}