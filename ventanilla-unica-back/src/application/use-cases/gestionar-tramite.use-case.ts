import { ForbiddenException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateDocumentoDto } from "src/domain/dto/create-documento.dto";
import { UpdateTramiteDto } from "src/domain/dto/update-tramite.dto";
import { Documento } from "src/domain/entities/documento.entity";
import { Tramite } from "src/domain/entities/tramite.entity";
import { EstadoTramite } from "src/domain/enums/estado-tramite.enum";
import { Rol } from "src/domain/enums/rol.enum";
import { IDocumentoRepository } from "src/domain/interfaces/i-documento.repository";
import { ITramiteRepository } from "src/domain/interfaces/i-tramite.repository";

@Injectable()
export class GestionarTramiteUseCase {

    constructor(@Inject('ITramiteRepository') private readonly tramiteRepository: ITramiteRepository, @Inject('IDocumentoRepository') private readonly documentoRepository: IDocumentoRepository) { }

    async actualizarEstado(tramiteId: number, dto: UpdateTramiteDto, usuarioID: number, rol: string): Promise<Tramite> {

        const tramite = await this.tramiteRepository.findById(tramiteId);

        if (!tramite) {
            throw new NotFoundException('Tramite no encontrado');
        }


        if (rol === Rol.CIUDADANO) {
            if (dto.estado === EstadoTramite.RECHAZADO) {

            } else if (dto.estado === EstadoTramite.PENDIENTE && tramite.estado === EstadoTramite.RECHAZADO) {
            } else {
                throw new ForbiddenException('No tienes permiso para actualizar el estado a este trámite');
            }
        }

        if(rol === Rol.EMPLEADO){
            const estadosPermitidos = [EstadoTramite.EN_PROCESO, EstadoTramite.COMPLETADO, EstadoTramite.RECHAZADO, EstadoTramite.CANCELADO];
            if(dto.estado && !estadosPermitidos.includes(dto.estado)){
                throw new ForbiddenException('No tienes permiso para actualizar el estado a este trámite');
            }
        }
        try{
            return this.tramiteRepository.update(tramiteId, dto);
        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar el estado del trámite');
        }
    }

    async subirDocumento(dto: CreateDocumentoDto, usuarioId: number, rol: string): Promise<Documento> {
        const tramite = await this.tramiteRepository.findById(dto.tramite_id);

        if(!tramite){
            throw new NotFoundException('Tramite no encontrado');
        }

        if(rol !== Rol.EMPLEADO && rol !== Rol.CIUDADANO && rol !== Rol.ADMIN){
            throw new ForbiddenException('No tienes permiso para subir documentos a este trámite');
        }

        if(rol !== Rol.EMPLEADO && rol !== Rol.CIUDADANO && rol !== Rol.ADMIN){
            throw new ForbiddenException('No tienes permiso para subir documentos a este trámite');
        }

        try{
            return this.documentoRepository.create(dto);
        } catch (error) {
            throw new InternalServerErrorException('Error al subir el documento');
        }
    }

    async obtenerPorCita(citaId: number): Promise<Tramite | null> {
        return this.tramiteRepository.findByCita(citaId);
    }

    async obtenerDocumentos(tramiteId: number): Promise<Documento[]> {
        return this.documentoRepository.findByTramite(tramiteId);
    }

    async obtenerPorId(tramiteId: number): Promise<Tramite>{
        const tramite = await this.tramiteRepository.findById(tramiteId)
        if(!tramite){
            throw new NotFoundException('Tramite no encontrado')
        }
        return tramite;
    }

}

