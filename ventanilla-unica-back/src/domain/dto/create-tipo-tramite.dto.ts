import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, MaxLength, IsOptional, IsNumber } from "class-validator";

export class CreateTipoTramiteDto {

    @ApiProperty({ description: 'El nombre del tipo de trámite', example: 'Renovacion dni', maxLength: 150 })
    @IsString({ message: 'El nombre del tipo de trámite debe ser un string' })
    @MaxLength(150, { message: 'El nombre del tipo de trámite no puede exceder los 150 caracteres' })
    nombre: string;

    @ApiPropertyOptional({ description: 'La descripción del tipo de trámite', example: 'Descripción del tipo de trámite', maxLength: 255 })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser un string' })
    @MaxLength(255, { message: 'La descripción no puede exceder los 255 caracteres' })
    descripcion?: string;

    @ApiPropertyOptional({ description: 'Los requisitos de documentos', example: 'Fotocopia del DNI' })
    @IsOptional()
    @IsString({ message: 'Los requisitos de documentos deben ser un string' })
    requisitos_documentos?: string;

    @ApiProperty({ description: 'El ID del tenant', example: 1 })
    @IsNumber({}, { message: 'El ID del tenant debe ser un número' })
    tenant_id: number;
}