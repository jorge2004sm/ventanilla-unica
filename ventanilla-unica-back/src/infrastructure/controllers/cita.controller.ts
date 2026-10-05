import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards, Request, Patch } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CrearCitaUseCase } from "src/application/use-cases/crear-cita.use-case";
import { GestionarCitaUseCase } from "src/application/use-cases/gestionar-cita.use-case";
import { roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { CreateCitaDto } from "src/domain/dto/create-cita.dto";
import { UpdateCitaDto } from "src/domain/dto/update-cita.dto";

@Controller('citas')
export class CitaController {
    constructor(private readonly gestionarCita: GestionarCitaUseCase, private readonly crearCita: CrearCitaUseCase) { }

    @Post()
    create(@Body() dto: CreateCitaDto) {
        return this.crearCita.execute(dto);
    }

    @Get('disponibilidad/:tenantId/:fecha')
    obtenerOcupadas(@Param('tenantId', ParseIntPipe) tenantId: number, @Param('fecha') fecha: string) {
        return this.crearCita.obtenerHorasOcupadas(tenantId, fecha);
    }

    @Get('tenant/:tenantId')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @roles('admin', 'empleado')
    findByTenant(@Param('tenantId', ParseIntPipe) tenantId: number, @Query('limit') limit?: number, @Query('offset') offset?: number) {
        return this.gestionarCita.obtenerPorTenant(tenantId, limit, offset);
    }

    @Get('mis-citas')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @roles('empleado')
    findMyCitas(@Request() req, @Query('fecha') fecha?: string, @Query('limit') limit?: number, @Query('offset') offset?: number) {
        return this.gestionarCita.obtenerPorEmpleado(req.user.id, fecha, limit, offset);
    }

    @Get('ciudadano')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @roles('ciudadano')
    findByCiudadano(@Request() req, @Query('limit') limit?: number, @Query('offset') offset?: number) {
        return this.gestionarCita.obtenerPorCiudadano(req.user.id, limit, offset)
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.gestionarCita.obtenerPorId(id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @roles('admin', 'empleado')
    updateEstado(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCitaDto, @Request() req) {
        return this.gestionarCita.actualizarEstado(id, dto, req.user.id, req.user.rol);
    }

    @Patch(':id/reasignar')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @roles('admin')
    reasignar(@Param('id', ParseIntPipe) id: number, @Body('empleado_id') empleadoId: number, @Request() req) {
        return this.gestionarCita.reasignarCita(id, empleadoId, req.user.rol);
    }

}