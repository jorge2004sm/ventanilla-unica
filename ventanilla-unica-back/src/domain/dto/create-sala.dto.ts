import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';

export class CreateSalaDto {

    @ApiProperty({ description: 'El nombre de la sala', example: 'Sala 1', maxLength: 100 })
    @IsString({ message: 'El nombre de la sala debe ser un string' })
    @MaxLength(100, { message: 'El nombre de la sala no puede exceder los 100 caracteres' })
    nombre: string;

    @ApiPropertyOptional({ description: 'La descripción de la sala', example: 'Descripción de la sala', maxLength: 255 })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser un string' })
    @MaxLength(255, { message: 'La descripción no puede exceder los 255 caracteres' })
    descripcion?: string;

    @ApiProperty({ description: 'El ID del tenant', example: 1 })
    @IsNumber({}, { message: 'El ID del tenant debe ser un número' })
    tenant_id: number;
}