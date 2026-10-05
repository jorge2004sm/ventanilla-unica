import { Repository } from "typeorm";
import { CitaOrmEntity } from "../cita.orm-entity";
import { ICitaRepository } from "src/domain/interfaces/i-cita.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Cita } from "src/domain/entities/cita.entity";


@Injectable()
export class CitaTypeOrmRepository implements ICitaRepository {
    constructor(@InjectRepository(CitaOrmEntity) private readonly repo: Repository<CitaOrmEntity>) { }

    /*
 * Busca todas las citas con sus relaciones.
 * Usado en: Vista admin para ver todas las citas del tenant.
 * Relations: empleado (nombre del empleado), ciudadano (si está registrado),
 * tenant (organización), tramite (estado del trámite asociado).
 */
    async findAll(limit?: number, offset?: number): Promise<Cita[]> {
        return this.repo.find({
            relations: ['empleado', 'ciudadano', 'tenant', 'tramite'],
            take: limit,
            skip: offset,
        });
    }

    /**
 * Busca una cita por ID con todas sus relaciones y tipo de trámite.
 * Usado en: Detalle de cita para empleado y admin.
 * Relations: empleado, ciudadano, tenant, tramite + tipoTramite (info completa del trámite).
 */
    async findById(id: number): Promise<Cita | null> {
        return this.repo.findOne({
            where: { id },
            relations: ['empleado', 'empleado.mesa.sala', 'ciudadano', 'tenant', 'tramite', 'tramite.tipoTramite', 'tramite.documentos'],
        });
    }

    /**
     * Busca citas de un empleado con filtros opcionales.
     * Usado en:
     * - Vista empleado: listado de citas del día con detalle del trámite.
     * - Vista admin: ver citas de un empleado para reasignar si está ausente.
     * Relations: empleado, ciudadano, tenant, tramite + tipoTramite (mostrar tipo y estado en el listado).
     * Filtros: fecha (opcional), paginación, ordenación cronológica.
     */
    async findCitasByEmpleado(empleadoId: number, fecha?: string, limit?: number, offset?: number, order?: "ASC" | "DESC"): Promise<Cita[]> {
        const query = this.repo.createQueryBuilder('cita')
            .leftJoinAndSelect('cita.empleado', 'empleado')
            .leftJoinAndSelect('cita.ciudadano', 'ciudadano')
            .leftJoinAndSelect('cita.tenant', 'tenant')
            .leftJoinAndSelect('cita.tramite', 'tramite')
            .leftJoinAndSelect('tramite.tipoTramite', 'tipoTramite')
            .where('empleado.id = :empleadoId', { empleadoId });

        if (fecha) {
            query.andWhere('cita.fecha = :fecha', { fecha });
        }

        query.orderBy('cita.hora_inicio', order || 'ASC');

        if (limit) query.take(limit);
        if (offset) query.skip(offset);

        return query.getMany();
    }

    /**
 * Busca citas de una fecha concreta en un tenant.
 * Usado en: Calcular huecos disponibles al crear una cita nueva.
 * Relations: empleado (saber qué empleados están ocupados), tramite + tipoTramite.
 */
    async findByFecha(fecha: string, tenantId: number): Promise<Cita[]> {
        return this.repo.find({
            where: { fecha: fecha as any, tenant: { id: tenantId } },
            relations: ['empleado', 'tramite', 'tramite.tipoTramite'],
            order: { hora_inicio: 'ASC' },
        });
    }

    /**
 * Busca todas las citas de un tenant.
 * Usado en: Vista admin para gestión general de citas de su organización.
 * Relations: empleado, tramite + tipoTramite.
 * Ordenado por fecha y hora ascendente.
 */
    async findByTenant(tenantId: number, limit?: number, offset?: number): Promise<Cita[]> {
        return this.repo.find({
            where: { tenant: { id: tenantId } },
            relations: ['empleado', 'tramite', 'tramite.tipoTramite'],
            take: limit,
            skip: offset,
            order: { fecha: 'ASC', hora_inicio: 'ASC' },
        });
    }
    /**
 * Busca citas de un ciudadano registrado.
 * Usado en: Historial de citas del ciudadano en su perfil.
 * Relations: empleado, tramite + tipoTramite, tenant (ver en qué organización fue).
 * Ordenado por fecha descendente (más recientes primero).
 */
    async findByCiudadano(ciudadanoId: number, limit?: number, offset?: number): Promise<Cita[]> {
        return this.repo.find({
            where: { ciudadano: { id: ciudadanoId } },
            relations: ['empleado', 'empleado.mesa.sala', 'tramite', 'tramite.tipoTramite', 'tramite.documentos', 'tenant'],
            take: limit,
            skip: offset,
            order: { fecha: 'DESC' },
        });
    }

    async create(cita: Partial<Cita>): Promise<Cita> {
        const entity = this.repo.create(cita);
        return this.repo.save(entity);
    }

    async update(id: number, cita: Partial<Cita>): Promise<Cita> {
        await this.repo.update(id, cita);
        const updated = await this.findById(id);
        if (!updated) throw new Error('Cita no encontrada');
        return updated;
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete(id);
    }
}