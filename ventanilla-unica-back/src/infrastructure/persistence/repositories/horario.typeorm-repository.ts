import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorarioOrmEntity } from '../horario.orm-entity';
import { IHorarioRepository } from '../../../domain/interfaces/i-horario.repository';
import { Horario } from '../../../domain/entities/horario.entity';

@Injectable()
export class HorarioTypeOrmRepository implements IHorarioRepository {

    constructor(
        @InjectRepository(HorarioOrmEntity)
        private readonly repo: Repository<HorarioOrmEntity>,
    ) {}


    async findAll(limit?: number, offset?: number): Promise<Horario[]> {
        return this.repo.find({
            take: limit,
            skip: offset,
        });
    }

    async findById(id: number): Promise<Horario | null> {
        return this.repo.findOne({ where: { id } });
    }

        /**
 * Busca horarios de un tenant con filtro opcional de activos.
 * Usado en: Vista admin para configurar horarios.
 * Filtro activo permite mostrar solo los vigentes o todos incluidos los desactivados.
 */
    async findByTenant(tenantId: number, activo?: boolean, limit?: number, offset?: number): Promise<Horario[]> {
        const where: any = { tenant: { id: tenantId } };
        if (activo !== undefined) {
            where.activo = activo;
        }
        return this.repo.find({
            where,
            take: limit,
            skip: offset,
        });
    }

    /**
 * Busca horarios base activos de un tenant.
 * Usado en: Calcular huecos disponibles al crear cita (horario normal del día).
 */
    async findBaseByTenant(tenantId: number): Promise<Horario[]> {
        return this.repo.find({
            where: {
                tenant: { id: tenantId },
                tipo: 'base' as any,
                activo: true,
            },
        });
    }

    /**
 * Busca horarios especiales activos de un tenant.
 * Usado en: Vista admin para ver excepciones configuradas (verano, navidad).
 */
    async findEspecialByTenant(tenantId: number): Promise<Horario[]> {
        return this.repo.find({
            where: {
                tenant: { id: tenantId },
                tipo: 'especial' as any,
                activo: true,
            },
        });
    }

    /**
 * Busca si hay un horario especial para una fecha concreta.
 * Usado en: Al crear cita, comprobar si ese día tiene horario especial o es festivo.
 * Si devuelve un horario con es_festivo=true, no se pueden pedir citas ese día.
 */
    async findByFecha(fecha: Date, tenantId: number): Promise<Horario | null> {
        return this.repo.createQueryBuilder('horario')
            .where('horario.tenant_id = :tenantId', { tenantId })
            .andWhere('horario.tipo = :tipo', { tipo: 'especial' })
            .andWhere('horario.fecha_inicio <= :fecha', { fecha })
            .andWhere('horario.fecha_fin >= :fecha', { fecha })
            .andWhere('horario.activo = true')
            .getOne();
    }

    async create(horario: Partial<Horario>): Promise<Horario> {
        const entity = this.repo.create(horario);
        return this.repo.save(entity);
    }

    async update(id: number, horario: Partial<Horario>): Promise<Horario> {
        await this.repo.update(id, horario);
        const updated = await this.findById(id);
        if (!updated) throw new Error('Horario no encontrado');
        return updated;
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete(id);
    }
}