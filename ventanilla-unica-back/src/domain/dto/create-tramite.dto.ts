import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTramiteDto {

    @ApiProperty({description: 'ID del tipo de tramite', example: 1})
    @IsNumber({}, { message: 'El ID del tipo de trámite debe ser un número' })
    tipo_tramite_id: number;

    @ApiProperty({description: 'ID de la cita', example: 1})
    @IsNumber({}, { message: 'El ID de la cita debe ser un número' })
    cita_id: number;

    @ApiPropertyOptional({description: 'Observaciones de la cita', example: 'Observacion de la cita'})
    @IsOptional()
    @IsString({ message: 'Las observaciones deben ser un string' })
    observaciones?: string;
}