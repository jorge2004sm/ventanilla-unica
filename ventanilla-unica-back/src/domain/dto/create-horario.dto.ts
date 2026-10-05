import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, IsDateString, MaxLength } from 'class-validator';
import { DiaSemana } from '../enums/dia-semana.enum';
import { TipoHorario } from '../enums/tipo-horario.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHorarioDto {

    @ApiProperty({ description: 'El tipo de horario', example: 'BASE' })
    @IsEnum(TipoHorario, { message: 'El tipo de horario debe ser un valor válido' })
    tipo: TipoHorario;

    @ApiProperty({ description: 'El día de la semana', example: 'LUNES' })
    @IsOptional()
    @IsEnum(DiaSemana, { message: 'El día de la semana debe ser un valor válido' })
    dia_semana?: DiaSemana;

    @ApiProperty({ description: 'La fecha de inicio', example: '2024-01-01' })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida' })
    fecha_inicio?: string;

    @ApiProperty({ description: 'La fecha de fin', example: '2024-01-01' })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida' })
    fecha_fin?: string;

    @ApiProperty({ description: 'La hora de inicio', example: '09:00' })
    @IsString({ message: 'La hora de inicio debe ser un string' })
    hora_inicio: string;

    @ApiProperty({ description: 'La hora de fin', example: '09:30' })
    @IsString({ message: 'La hora de fin debe ser un string' })
    hora_fin: string;

    @ApiPropertyOptional({ description: 'La duración de la cita en minutos', example: 30 })
    @IsOptional()
    @IsNumber({}, { message: 'La duración de la cita debe ser un número' })
    duracion_cita?: number;

    @ApiPropertyOptional({ description: 'Indica si es un día festivo', example: false })
    @IsOptional()
    @IsBoolean({ message: 'El campo es_festivo debe ser un booleano' })
    es_festivo?: boolean;

    @ApiPropertyOptional({ description: 'Una descripción del horario', example: 'Horario de atención al público' })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser un string' })
    @MaxLength(255, { message: 'La descripción no puede exceder los 255 caracteres' })
    descripcion?: string;

    @ApiProperty({ description: 'Indica si el horario está activo', example: true })
    @IsNumber({}, { message: 'El ID del tenant debe ser un número' })
    tenant_id: number;
}