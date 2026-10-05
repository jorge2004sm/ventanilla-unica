import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class UpdateSalaDto {

    @ApiPropertyOptional({ description: 'Nombre de la sala', example: 'Sala 1', maxLength: 100})
    @IsOptional()
    @IsString({ message: 'El nombre de la sala debe ser un string' })
    @MaxLength(100, { message: 'El nombre de la sala no puede exceder los 100 caracteres' })
    nombre?: string;

    @ApiPropertyOptional({ description: 'Descripcion de la sala', example: 'Descripcion de la sala', maxLength: 255})
    @IsOptional()
    @IsString({ message: 'La descripción de la sala debe ser un string' })
    @MaxLength(255, { message: 'La descripción de la sala no puede exceder los 255 caracteres' })
    descripcion?: string;

    @ApiPropertyOptional({ description: 'Indica si la sala esta activa', example: false})
    @IsOptional()
    @IsBoolean({ message: 'El campo "activa" debe ser un booleano' })
    activa?: boolean;
}