import { IsOptional, IsString, IsEnum } from 'class-validator';
import { EstadoTramite } from '../enums/estado-tramite.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTramiteDto {

    @ApiPropertyOptional({ description: 'Estado del tramite', example: 'PENDIENTE', })
    @IsOptional()
    @IsEnum(EstadoTramite, { message: 'El estado del trámite debe ser un valor válido' })
    estado?: EstadoTramite;

    @ApiPropertyOptional({ description: 'Observaciones del tramite', example: 'Tramite en curso'})
    @IsOptional()
    @IsString({ message: 'Las observaciones del trámite deben ser un string' })
    observaciones?: string;
}