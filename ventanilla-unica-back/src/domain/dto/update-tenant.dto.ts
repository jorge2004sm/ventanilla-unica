import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateTenantDto {

    @ApiPropertyOptional({description: 'Nombre del tenant', example: 'Tenant 1', maxLength: 150})
    @IsOptional()
    @IsString({ message: 'El nombre del tenant debe ser un string' })
    @MaxLength(150, { message: 'El nombre del tenant no puede exceder los 150 caracteres' })
    nombre?: string;

    @ApiPropertyOptional({ description: 'Direccion del tenant', example: 'Calle Sol', maxLength: 255})
    @IsOptional()
    @IsString({ message: 'La dirección del tenant debe ser un string' })
    @MaxLength(255, { message: 'La dirección del tenant no puede exceder los 255 caracteres' })
    direccion?: string;

    @ApiPropertyOptional({description: 'Telefono del tenant', example: '712839204', maxLength: 20})
    @IsOptional()
    @IsString({ message: 'El teléfono del tenant debe ser un string' })
    @MaxLength(20, { message: 'El teléfono del tenant no puede exceder los 20 caracteres' })
    telefono?: string;

    @ApiPropertyOptional({description: 'Email del tenant', example: 'tenant@gamil.com', maxLength: 150})
    @IsOptional()
    @IsEmail({}, { message: 'El email del tenant debe ser un email válido' })
    @MaxLength(150, { message: 'El email del tenant no puede exceder los 150 caracteres' })
    email?: string;

    @ApiPropertyOptional({ description: 'Indica si el tenant esta activo', example: false})
    @IsOptional()
    @IsBoolean({ message: 'El campo "activo" debe ser un booleano' })
    activo?: boolean;

}