import { IsOptional, IsEnum, IsDateString, IsString, IsNumber, IsBoolean, MaxLength } from "class-validator";
import { DiaSemana } from "../enums/dia-semana.enum";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateHorarioDto {
    @ApiPropertyOptional({description: 'Dia de la semana', example: 'LUNES'})
    @IsOptional()
    @IsEnum(DiaSemana, { message: 'El día de la semana debe ser un valor válido' })
    dia_semana?: DiaSemana;

    @ApiPropertyOptional({ description: 'Fecha de inicio del horario', example: '2026-01-01'})
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida' })
    fecha_inicio?: string;

    @ApiPropertyOptional({ description: 'Fecha de fin del horario', example: '2026-01-01'})
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida' })
    fecha_fin?: string;

    @ApiPropertyOptional({ description: 'Hora de inicio del horario', example: '09:00'})
    @IsOptional()
    @IsString({ message: 'La hora de inicio debe ser un string' })
    hora_inicio?: string;

    @ApiPropertyOptional({ description: 'Hora de fin del horario', example: '09:00'})
    @IsOptional()
    @IsString({ message: 'La hora de fin debe ser un string' })
    hora_fin?: string;

    @ApiPropertyOptional({ description: 'Duracion de la cita en minutos', example: 30})
    @IsOptional()
    @IsNumber({}, { message: 'La duración de la cita debe ser un número' })
    duracion_cita?: number;

    @ApiPropertyOptional({ description: 'Indica si es festivo', example: false})    
    @IsOptional()
    @IsBoolean({ message: 'El campo "es_festivo" debe ser un booleano' })
    es_festivo?: boolean;

    @ApiPropertyOptional({ description: 'Descripcion del horario', example: 'Descripcion del horario', maxLength: 255})
    @IsOptional()
    @IsString({ message: 'La descripción debe ser un string' })
    @MaxLength(255, { message: 'La descripción no puede exceder los 255 caracteres' })
    descripcion?: string;

    @ApiPropertyOptional({ description: 'Indica si el horario esta activo', example: false})
    @IsOptional()
    @IsBoolean({ message: 'El campo "activo" debe ser un booleano' })
    activo?: boolean;
}