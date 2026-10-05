import { Injectable, NotFoundException, ForbiddenException, Inject, InternalServerErrorException } from '@nestjs/common';
import { ITipoTramiteRepository } from '../../domain/interfaces/i-tipo-tramite.repository';
import { CreateTipoTramiteDto } from '../../domain/dto/create-tipo-tramite.dto';
import { UpdateTipoTramiteDto } from '../../domain/dto/update-tipo-tramite.dto';
import { TipoTramite } from '../../domain/entities/tipo-tramite.entity';
import { Rol } from 'src/domain/enums/rol.enum';

@Injectable()
export class GestionarTipoTramiteUseCase {

    constructor(
        @Inject('ITipoTramiteRepository') private readonly tipoTramiteRepository: ITipoTramiteRepository,
    ) {}

    async crear(dto: CreateTipoTramiteDto, rol: string): Promise<TipoTramite> {

        if (rol !== Rol.ADMIN) {
            throw new ForbiddenException('Solo un admin puede crear tipos de trámite');
        }
        try{
        return this.tipoTramiteRepository.create({
            nombre: dto.nombre,
            descripcion: dto.descripcion,
            requisitos_documentos: dto.requisitos_documentos,
            tenant: { id: dto.tenant_id } as any,
        });
        } catch (error) {
            throw new InternalServerErrorException('Error al crear el tipo de trámite');
        }

    }

    async actualizar(tipoTramiteId: number, dto: UpdateTipoTramiteDto, rol: string): Promise<TipoTramite> {

        if (rol !== Rol.ADMIN) {
            throw new ForbiddenException('Solo un admin puede modificar tipos de trámite');
        }

        const tipo = await this.tipoTramiteRepository.findById(tipoTramiteId);

        if (!tipo) {
            throw new NotFoundException('Tipo de trámite no encontrado');
        }
        try{
            return this.tipoTramiteRepository.update(tipoTramiteId, dto);
        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar el tipo de trámite');
        }
    }

    async obtenerPorTenant(tenantId: number, limit?: number, offset?: number): Promise<TipoTramite[]> {
        return this.tipoTramiteRepository.findByTenant(tenantId, limit, offset);
    }

    async obtenerTodos(limit?: number, offset?: number): Promise<TipoTramite[]> {
        return this.tipoTramiteRepository.findAll(limit, offset);
    }

    async obtenerPorId(tipoTramiteId: number): Promise<TipoTramite> {

        const tipo = await this.tipoTramiteRepository.findById(tipoTramiteId);

        if (!tipo) {
            throw new NotFoundException('Tipo de trámite no encontrado');
        }

        return tipo;
    }
}