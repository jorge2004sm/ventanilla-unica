import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards, Request, Patch, Delete } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GestionarTenantUseCase } from "src/application/use-cases/gestionar-tenant.use-case";
import { roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { CreateTenantDto } from "src/domain/dto/create-tenant.dto";
import { UpdateTenantDto } from "src/domain/dto/update-tenant.dto";

@Controller('tenants')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TenantController {
    constructor(private readonly gestionarTenant: GestionarTenantUseCase) { }

    @Get()
    findAll(@Query('limit') limit?: number, @Query('offset') offset?: number) {
        return this.gestionarTenant.obtenerTodos(limit, offset);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.gestionarTenant.obtenerPorId(id);
    }

    @Post()
    @roles('superadmin')
    create(@Body() dto: CreateTenantDto, @Request() req) {
        return this.gestionarTenant.crear(dto, req.user.rol);
    }

    @Patch(':id')
    @roles('superadmin')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTenantDto, @Request() req) {
        return this.gestionarTenant.actualizar(id, dto, req.user.rol);
    }

    @Delete(':id')
    @roles('superadmin')
    deactivate(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.gestionarTenant.desactivar(id, req.user.rol);
    }
}
