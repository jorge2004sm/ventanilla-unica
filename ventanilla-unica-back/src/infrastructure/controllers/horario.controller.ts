import { UseGuards, ParseIntPipe, Controller, Get, Param, Query, Body, Post, Request, Patch } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { GestionarHorarioUseCase } from "src/application/use-cases/gestionar-horario.use-case";
import { roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateHorarioDto } from 'src/domain/dto/create-horario.dto';
import { UpdateHorarioDto } from 'src/domain/dto/update-horario.dto';

@Controller('horarios')
export class HorarioController {
    constructor(private readonly gestionarHorario: GestionarHorarioUseCase) { }

    @Get('tenant/:tenantId')
    findByTenant(@Param('tenantId', ParseIntPipe) tenantId: number, @Query('activo') activo?: string, @Query('limit') limit?: number, @Query('offset') offset?: number) {
        const activoBool = activo === 'true' ? true : activo === 'false' ? false : undefined;
        return this.gestionarHorario.obtenerPorTenant(tenantId, activoBool, limit, offset)
    }

    @Get('tenant/:tenantId/base')
    findBase(@Param('tenantId', ParseIntPipe) tenantId: number) {
        return this.gestionarHorario.obtenerBaseByTenant(tenantId)
    }

    @Get('tenant/:tenantId/especiales')
    findEspeciales(@Param('tenantId', ParseIntPipe) tenantId: number) {
        return this.gestionarHorario.obtenerEspecialByTenant(tenantId);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @roles('admin')
    create(@Body() dto: CreateHorarioDto, @Request() req) {
        return this.gestionarHorario.crear(dto, req.user.rol)
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @roles('admin')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHorarioDto, @Request() req) {
        return this.gestionarHorario.actualizar(id, dto, req.user.rol);
    }
}