import { ForbiddenException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateUsuarioDto } from "src/domain/dto/create-usuario.dto";
import { Usuario } from "src/domain/entities/usuario.entity";
import { IRolRepository } from "src/domain/interfaces/i-rol.repository";
import { IUsuarioRepository } from "src/domain/interfaces/i-usuario.repository";
import * as bcrypt from 'bcrypt';
import { UpdateUsuarioDto } from "src/domain/dto/update-usuario.dto";
import { Rol } from "src/domain/enums/rol.enum";

@Injectable()
export class GestionarUsuarioUseCase {
    constructor(@Inject('IUsuarioRepository') private readonly usuarioRepository: IUsuarioRepository,
        @Inject('IRolRepository') private readonly rolRepository: IRolRepository) { }


    async crear(dto: CreateUsuarioDto, rol: string): Promise<Usuario> {
        if (rol !== Rol.ADMIN && rol !== Rol.SUPERADMIN) {
            throw new ForbiddenException('Solo un admin o superadmin puede crear usuarios');
        }
        const rolEntity = await this.rolRepository.findById(dto.rol_id);

        if (!rolEntity) {
            throw new NotFoundException('Rol no encontrado');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(dto.password, salt);

        try {
            return this.usuarioRepository.create({
                nombre: dto.nombre,
                apellidos: dto.apellidos,
                email: dto.email,
                password: hashedPassword,
                dni: dto.dni,
                rol: rolEntity as any,
                tenant: dto.tenant_id ? { id: dto.tenant_id } as any : null,
                mesa: dto.mesa_id ? { id: dto.mesa_id } as any : null,
            });
        } catch (error) {
            throw new InternalServerErrorException('Error al crear el usuario');
        }

    }

    async actualizar(usuarioId: number, dto: UpdateUsuarioDto, rol: string): Promise<Usuario> {
        if (rol !== Rol.ADMIN && rol !== Rol.SUPERADMIN) {
            throw new ForbiddenException('Solo un admin o superadmin puede actualizar usuarios');
        }

        const usuario = await this.usuarioRepository.findById(usuarioId);

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const updateData: any = { ...dto };

        if (dto.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(dto.password, salt);
        }

        if (dto.rol_id) {
            updateData.rol = { id: dto.rol_id };
        }

        if (dto.tenant_id) {
            updateData.tenant = { id: dto.tenant_id };
        }

        if (dto.mesa_id) {
            updateData.mesa = { id: dto.mesa_id };
        }

        try {
            return this.usuarioRepository.update(usuarioId, updateData);

        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar el usuario');
        }
    }

    async desactivar(usuarioId: number, rol: string): Promise<Usuario> {
        if (rol !== Rol.ADMIN && rol !== Rol.SUPERADMIN) {
            throw new ForbiddenException('Solo un admin o superadmin puede desactivar usuarios');
        }

        const usuario = await this.usuarioRepository.findById(usuarioId);

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }
        try{
            return this.usuarioRepository.update(usuarioId, { activo: false });
        } catch (error) {
            throw new InternalServerErrorException('Error al desactivar el usuario');
        }
    }

    async obtenerPorTenant(tenantId: number, limit?: number, offset?: number): Promise<Usuario[]> {
        return this.usuarioRepository.findByTenant(tenantId, limit, offset);
    }

    async obtenerPorId(usuarioId: number): Promise<Usuario> {
        const usuario = await this.usuarioRepository.findById(usuarioId);
        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }
        return usuario;
    }

    async obtenerTodos(limit?: number, offset?: number): Promise<Usuario[]> {
        return this.usuarioRepository.findAll(limit, offset);
    }

}