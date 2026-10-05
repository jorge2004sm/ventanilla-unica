import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Max, MaxLength } from "class-validator";

export class CreateTenantDto {

    @ApiProperty({ description: 'El nombre del tenant', example: 'Tenant 1', maxLength: 150 })
    @IsString({ message: 'El nombre del tenant debe ser un string' })
    @MaxLength(150, { message: 'El nombre del tenant no puede exceder los 150 caracteres' })
    nombre: string;

    @ApiPropertyOptional({ description: 'La dirección del tenant', example: 'Dirección del tenant', maxLength: 255 })
    @IsOptional()
    @IsString({ message: 'La dirección debe ser un string' })
    @MaxLength(255, { message: 'La dirección no puede exceder los 255 caracteres' })
    direccion?: string;

    @ApiPropertyOptional({ description: 'El teléfono del tenant', example: '671234567', maxLength: 20 })
    @IsOptional()
    @IsString({ message: 'El teléfono debe ser un string' })
    @MaxLength(20, { message: 'El teléfono no puede exceder los 20 caracteres' })
    telefono?: string;

    @ApiPropertyOptional({ description: 'El email del tenant', example: 'tenant@example.com', maxLength: 150 })
    @IsOptional()
    @IsString({ message: 'El email debe ser un string' })
    @MaxLength(150, { message: 'El email no puede exceder los 150 caracteres' })
    email?: string;

    

}