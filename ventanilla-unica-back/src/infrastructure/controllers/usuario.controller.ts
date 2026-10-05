import { Controller, Get, Param, Query, UseGuards, ParseIntPipe, Post, Body, Request, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { GestionarUsuarioUseCase } from '../../application/use-cases/gestionar-usuario.use-case';
import { CreateUsuarioDto } from 'src/domain/dto/create-usuario.dto';
import { UpdateUsuarioDto } from 'src/domain/dto/update-usuario.dto';
import { roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('usuarios')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsuarioController{
    constructor(private readonly gestionarUsuario: GestionarUsuarioUseCase) { }

    @Get()
    @roles('admin', 'superadmin')
    findAll(@Query('limit') limit?: number, @Query('offset') offset?: number) {
        return this.gestionarUsuario.obtenerTodos(limit, offset);
    }

    @Get('tenant/:tenantId')
    @roles('admin', 'superadmin')
    findByTenant(@Param('tenantId') tenantId: number, @Query('limit') limit?: number, @Query('offset') offset?: number) {
        return this.gestionarUsuario.obtenerPorTenant(tenantId, limit, offset);
    }

    @Get(':id')
    @roles('admin', 'superadmin')
    findOne(@Param('id', ParseIntPipe) id: number) {
       return this.gestionarUsuario.obtenerPorId(id);
    }

    @Post()
    @roles('admin', 'superadmin')
    create(@Body() dto: CreateUsuarioDto, @Request() req) {
        return this.gestionarUsuario.crear(dto, req.user.rol);
    }

    @Patch(':id')
    @roles('admin', 'superadmin')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUsuarioDto, @Request() req) {
        return this.gestionarUsuario.actualizar(id, dto, req.user.rol);
    }

    @Delete(':id')
    @roles('admin', 'superadmin')
    deactivate(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.gestionarUsuario.desactivar(id, req.user.rol);
    }

}