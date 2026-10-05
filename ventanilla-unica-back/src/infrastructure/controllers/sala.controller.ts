import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GestionarSalaMesaUseCase } from "src/application/use-cases/gestionar-sala-mesa.use-case";
import { UpdateSalaDto } from "src/domain/dto/update-sala.dto";
import { CreateSalaDto } from "src/domain/dto/create-sala.dto";
import { roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";

@Controller('salas')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SalaController {

    constructor(private readonly gestionarSalaMesa: GestionarSalaMesaUseCase) { }

    @Get('tenant/:tenantId')
    @roles('admin', 'empleado')
    findByTenant(@Param('tenantId', ParseIntPipe) tenantId: number, @Query('limit') limit?: number, @Query('offset') offset?: number) {
        return this.gestionarSalaMesa.obtenerSalasPorTenant(tenantId, limit, offset);
    }

    @Post()
    @roles('admin')
    create(@Body() dto: CreateSalaDto, @Request() req) {
        return this.gestionarSalaMesa.crearSala(dto, req.user.rol);
    }

    @Patch(':id')
    @roles('admin')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSalaDto, @Request() req) {
        return this.gestionarSalaMesa.actualizarSala(id, dto, req.user.rol);
    }
}