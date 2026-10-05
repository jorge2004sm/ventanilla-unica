import { AuthGuard } from "@nestjs/passport";
import { GestionarVacacionUseCase } from "src/application/use-cases/gestionar-vacacion.use-case";
import { Body, Controller, Get, Post, Query, UseGuards, Request, ParseIntPipe, Param, Patch } from "@nestjs/common";
import { CreateVacacionDto } from "src/domain/dto/create-vacacion.dto";
import { EstadoVacacion } from "src/domain/enums/estado-vacacion.enum";
import { roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";

@Controller('vacaciones')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class VacacionController {
    constructor(private readonly gestionarVacacion: GestionarVacacionUseCase) { }

    @Post()
    @roles('empleado')
    solicitar(@Body() dto: CreateVacacionDto) {
        return this.gestionarVacacion.solicitar(dto)
    }

    @Get('mis-vacaciones')
    @roles('empleado')
    findMine(@Request() req, @Query('limit') limit?: number, @Query('offset') offset?: number) {
        return this.gestionarVacacion.obtenerPorUsuario(req.user.id, limit, offset)
    }

    @Get('pendientes')
    @roles('admin')
    findPendientes(@Query('limit') limit?: number, @Query('offset') offset?: number) {
        return this.gestionarVacacion.obtenerPendientes(limit, offset)
    }

    @Get(':id/citas-afectadas')
    @roles('admin')
    citasAfectadas(@Param('id', ParseIntPipe) id: number) {
        return this.gestionarVacacion.obtenerCitasAfectadas(id);
    }

    @Patch(':id/aprobar')
    @roles('admin')
    aprobar(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.gestionarVacacion.aprobarORechazar(id, EstadoVacacion.APROBADA, req.user.id, req.user.rol);
    }

    @Patch(':id/rechazar')
    @roles('admin')
    rechazar(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.gestionarVacacion.aprobarORechazar(id, EstadoVacacion.RECHAZADA, req.user.id, req.user.rol)
    }

}