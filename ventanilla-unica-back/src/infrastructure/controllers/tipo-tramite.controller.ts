import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GestionarTipoTramiteUseCase } from "src/application/use-cases/gestionar-tipo-tramite.use-case";
import { roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";

import { CreateTipoTramiteDto } from "src/domain/dto/create-tipo-tramite.dto";
import { UpdateTipoTramiteDto } from "src/domain/dto/update-tipo-tramite.dto";

@Controller('tipos-tramite')
export class TipoTramiteController {
    constructor(private readonly gestionarTipoTramite: GestionarTipoTramiteUseCase) { }

    @Get()
    findAll(@Query('limit') limit?: number, @Query('offset') offset?: number) {
        return this.gestionarTipoTramite.obtenerTodos(limit, offset);
    }

    @Get('tenant/:tenantId')
    findByTenant(@Param('tenantId') tenantId: number, @Query('limit') limit?: number, @Query('offset') offset?: number) {
        return this.gestionarTipoTramite.obtenerPorTenant(tenantId, limit, offset);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.gestionarTipoTramite.obtenerPorId(id);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @roles('admin')
    create(@Body() dto: CreateTipoTramiteDto, @Request() req) {
        return this.gestionarTipoTramite.crear(dto, req.user.rol);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @roles('admin')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTipoTramiteDto, @Request() req) {
        return this.gestionarTipoTramite.actualizar(id, dto, req.user.rol);
    }
}