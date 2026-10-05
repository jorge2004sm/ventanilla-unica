import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsBoolean } from 'class-validator';

export class UpdateTipoTramiteDto {

    @ApiPropertyOptional({ description: 'Nombre del tipo de tramite', example: 'Renovacion de DNI', maxLength: 150 })
    @IsOptional()
    @IsString({ message: 'El nombre del tipo de trámite debe ser un string' })
    @MaxLength(150, { message: 'El nombre del tipo de trámite no puede exceder los 150 caracteres' })
    nombre?: string;

    @ApiPropertyOptional({ description: 'Descripcion del tipo de tramite', example: 'Renovacion de dni', maxLength: 255 })
    @IsOptional()
    @IsString({ message: 'La descripción del tipo de trámite debe ser un string' })
    @MaxLength(255, { message: 'La descripción del tipo de trámite no puede exceder los 255 caracteres' })
    descripcion?: string;

    @ApiPropertyOptional({ description: 'Requisitos de documentos', example: 'Fotocopia de dni', maxLength: 255 })
    @IsOptional()
    @IsString({ message: 'Los requisitos de documentos deben ser un string' })
    @MaxLength(255, { message: 'Los requisitos de documentos no pueden exceder los 255 caracteres' })
    requisitos_documentos?: string;

    @ApiPropertyOptional({ description: 'Indica si el tipo de trámite está activo', example: false })
    @IsOptional()
    @IsBoolean({ message: 'El campo activo debe ser un booleano' })
    activo?: boolean;
}