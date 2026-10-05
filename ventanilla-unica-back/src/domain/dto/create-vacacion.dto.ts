import { IsString, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { TipoVacacion } from '../enums/tipo-vacacion.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVacacionDto {

    @ApiProperty({ description: 'Fecha de inicio de las vacaciones', example: '2026-01-01'})
    @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida' })
    fecha_inicio: string;

    @ApiProperty({ description: 'Fecha de fin de las vacaciones', example: '2026-01-01'})
    @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida' })
    fecha_fin: string;

    @ApiProperty({ description: 'Tipo de vacacion', example: 'VACACIONES'})    
    @IsEnum(TipoVacacion, { message: 'El tipo de vacación debe ser uno de los valores válidos' })
    tipo: TipoVacacion;

    @ApiPropertyOptional({ description: 'Motivo de las vacaciones', example: 'Vacaciones de verano'})
    @IsOptional()
    @IsString({ message: 'El motivo debe ser un string' })
    motivo?: string;

    @ApiProperty({ description: 'ID del usuario', example: 1})
    @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
    usuario_id: number;
}