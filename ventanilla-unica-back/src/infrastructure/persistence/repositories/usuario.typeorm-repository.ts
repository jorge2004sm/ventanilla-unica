import { Inject, Injectable } from "@nestjs/common";
import { IUsuarioRepository } from "src/domain/interfaces/i-usuario.repository";
import { UsuarioOrmEntity } from "../usuario.orm-entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario } from "src/domain/entities/usuario.entity";

@Injectable()
export class UsuarioTypeOrmRepository implements IUsuarioRepository {


    constructor(@InjectRepository(UsuarioOrmEntity) private readonly repo: Repository<UsuarioOrmEntity>) { }

    /**
 * Busca todos los usuarios.
 * Usado en: Vista superadmin para gestión global.
 */
    async findAll(limit?: number, offset?: number): Promise<Usuario[]> {
        return this.repo.find({
            take: limit,
            skip: offset
        });
    }

    /**
 * Busca un usuario por ID.
 * Usado en: Detalle de usuario, validación JWT.
 */
    async findById(id: number): Promise<Usuario | null> {
        return this.repo.findOne({ where: { id } });
    }

    /**
 * Busca un usuario por email incluyendo password.
 * Usado en: Login para validar credenciales con bcrypt.
 * Select incluye password porque normalmente está oculto (select: false).
 */
    async findByEmail(email: string): Promise<Usuario | null> {
        return this.repo.findOne({
            where: { email },
            select: ['id', 'nombre', 'apellidos', 'email', 'password', 'dni', 'telefono', 'activo'],
        });
    }

    /**
 * Busca usuarios de un tenant.
 * Usado en: Vista admin para gestionar empleados de su organización.
 */
    async findByTenant(tenantId: number, limit?: number, offset?: number): Promise<Usuario[]> {
        return this.repo.find({
            where: { tenant: { id: tenantId } },
            take: limit,
            skip: offset
        });
    }

    /**
 * Busca empleados activos de un tenant con su mesa y rol.
 * Usado en: Asignar empleado disponible al crear cita y reasignar citas.
 * Relations: mesa (saber en qué mesa está), rol (filtrar solo empleados).
 */
    async findDisponibles(tenantId: number): Promise<Usuario[]> {
        return this.repo.find({
            where: {
                tenant: { id: tenantId },
                activo: true,
                rol: { nombre: 'empleado' }  // ← añadir esto
            },
            relations: ['mesa', 'rol'],
        });
    }

    async create(usuario: Partial<Usuario>): Promise<Usuario> {
        const entity = this.repo.create(usuario);
        return this.repo.save(entity);
    }

    async update(id: number, usuario: Partial<Usuario>): Promise<Usuario> {
        await this.repo.update(id, usuario);
        const updated = await this.findById(id);
        if (!updated) {
            throw new Error('Usuario no encontrado');
        }
        return updated;
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete(id);
    }
}