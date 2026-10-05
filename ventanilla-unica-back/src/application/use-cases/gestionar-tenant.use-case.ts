import { ForbiddenException, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateTenantDto } from "src/domain/dto/create-tenant.dto";
import { UpdateTenantDto } from "src/domain/dto/update-tenant.dto";
import { Tenant } from "src/domain/entities/tenant.entity";
import { Rol } from "src/domain/enums/rol.enum";
import { ITenantRepository } from "src/domain/interfaces/i-tenant.repository";

@Injectable()
export class GestionarTenantUseCase {
    constructor(
        @Inject('ITenantRepository') private readonly tenantRepository: ITenantRepository) { }


    async crear(dto: CreateTenantDto, rol: string): Promise<Tenant> {
        if (rol !== Rol.SUPERADMIN) {
            throw new ForbiddenException('Solo un superadmin puede crear tenants');
        }
        try {
            return this.tenantRepository.create(dto);
        } catch (error) {
            throw new InternalServerErrorException('Error al crear el tenant');
        }
    }

    async actualizar(tenantId: number, dto: UpdateTenantDto, rol: string): Promise<Tenant> {
        if (rol !== Rol.SUPERADMIN) {
            throw new ForbiddenException('Solo un superadmin puede actualizar tenants');
        }

        const tenant = await this.tenantRepository.findById(tenantId);
        if (!tenant) {
            throw new ForbiddenException('Tenant no encontrado');
        }
        try {
            return this.tenantRepository.update(tenantId, dto);
        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar el tenant');
        }
    }

    async desactivar(tenantId: number, rol: string): Promise<Tenant> {
        if (rol !== Rol.SUPERADMIN) {
            throw new ForbiddenException('Solo un superadmin puede desactivar tenants');
        }

        const tenant = await this.tenantRepository.findById(tenantId);
        if (!tenant) {
            throw new ForbiddenException('Tenant no encontrado');
        }
        try {
            return this.tenantRepository.update(tenantId, { activo: false });

        } catch (error) {
            throw new InternalServerErrorException('Error al desactivar el tenant');
        }
    }

    async obtenerTodos(limit?: number, offset?: number): Promise<Tenant[]> {
        return this.tenantRepository.findAll(limit, offset);
    }

    async obtenerPorId(tenantId: number): Promise<Tenant> {
        const tenant = await this.tenantRepository.findById(tenantId);
        if (!tenant) {
            throw new ForbiddenException('Tenant no encontrado');
        }
        return tenant;
    }

    async obtenerPorTipoTramite(tipoTramiteId: number, limit?: number, offset?: number): Promise<Tenant[]> {
        return this.tenantRepository.findByTipoTramite(tipoTramiteId, limit, offset);
    }
}