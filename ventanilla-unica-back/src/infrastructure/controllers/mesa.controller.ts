import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GestionarSalaMesaUseCase } from "src/application/use-cases/gestionar-sala-mesa.use-case";
import { roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { CreateMesaDto } from "src/domain/dto/create-mesa.dto";
import { UpdateMesaDto } from "src/domain/dto/update-mesa.dto";


@Controller('mesas')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MesaController {

    constructor(private readonly gestionarSalaMesa: GestionarSalaMesaUseCase) { }

    @Get('sala/:salaId')
    @roles('admin', 'empleado')
    findBySala(@Param('salaId', ParseIntPipe) salaId: number) {
        return this.gestionarSalaMesa.obtenerMesasPorSala(salaId);
    }

    @Post()
    @roles('admin')
    create(@Body() dto: CreateMesaDto, @Request() req) {
        return this.gestionarSalaMesa.crearMesa(dto, req.user.rol);
    }

    @Patch(':id')
    @roles('admin')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMesaDto, @Request() req) {
        return this.gestionarSalaMesa.actualizarMesa(id, dto, req.user.rol);
    }
}