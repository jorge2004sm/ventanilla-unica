import { Body, Controller, Get, Param, ParseIntPipe, Patch, UseGuards, Request, Post, UploadedFile, UseInterceptors } from "@nestjs/common";

import { GestionarTramiteUseCase } from "src/application/use-cases/gestionar-tramite.use-case";
import { AuthGuard } from "@nestjs/passport";

import { UpdateTramiteDto } from "src/domain/dto/update-tramite.dto";
import { CreateDocumentoDto } from "src/domain/dto/create-documento.dto";
import { roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('tramites')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TramiteController {
    constructor(private readonly gestionarTramite: GestionarTramiteUseCase) { }

    @Get(':id')
    @roles('admin', 'empleado', 'ciudadano')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.gestionarTramite.obtenerPorId(id)
    }

    @Get('cita/:citaId')
    @roles('admin', 'empleado', 'ciudadano')
    findByCita(@Param('citaId', ParseIntPipe) citaId: number) {
        return this.gestionarTramite.obtenerPorCita(citaId)
    }

    @Patch(':id')
    @roles('admin', 'empleado', 'ciudadano')
    updateEstado(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTramiteDto, @Request() req) {
        return this.gestionarTramite.actualizarEstado(id, dto, req.user.id, req.user.rol);
    }

    @Get(':id/documentos')
    @roles('admin', 'empleado', 'ciudadano')
    getDocumentos(@Param('id', ParseIntPipe) id: number) {
        return this.gestionarTramite.obtenerDocumentos(id)
    }

    @Post(':id/documentos')
    @roles('admin', 'empleado')
    @UseInterceptors(FileInterceptor('archivo', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, uniqueSuffix + extname(file.originalname));
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
    }))
    uploadDocumento(
        @Param('id', ParseIntPipe) tramiteId: number,
        @UploadedFile() archivo: Express.Multer.File,
        @Request() req
    ) {
        const dto = {
            nombre_archivo: archivo.originalname,
            ruta_archivo: `/uploads/${archivo.filename}`,
            tramite: { id: tramiteId } as any,
        };
        return this.gestionarTramite.subirDocumento(dto as any, req.user.id, req.user.rol);
    }
}