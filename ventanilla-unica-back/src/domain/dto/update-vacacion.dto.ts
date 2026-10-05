import { IsOptional, IsNumber, IsEnum } from 'class-validator';
import { EstadoVacacion } from '../enums/estado-vacacion.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateVacacionDto {

    @ApiPropertyOptional({ description: 'Estado de la vacacion', example: 'APROBADA'})
    @IsOptional()
    @IsEnum(EstadoVacacion, { message: 'El estado de la vacación debe ser un valor válido' })
    estado?: EstadoVacacion;

    @ApiPropertyOptional({ description: 'ID del usuario que aprueba la vacacion', example: 1})
    @IsOptional()
    @IsNumber({}, { message: 'El ID del usuario que aprueba debe ser un número' })
    aprobado_por?: number;
}