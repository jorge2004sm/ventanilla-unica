import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, IsEmail, MinLength, IsBoolean, IsNumber } from "class-validator";

export class UpdateUsuarioDto {
    @ApiPropertyOptional({ description: 'Nombre del usuario', example: 'Jorge', maxLength: 100})
    @IsOptional()
    @IsString({ message: 'El nombre del usuario debe ser un string' })
    @MaxLength(100, { message: 'El nombre del usuario no puede exceder los 100 caracteres' })
    nombre?: string;

    @ApiPropertyOptional({description: 'Apellidos del usuario', example: 'Sanchez Perez', maxLength: 150})
    @IsOptional()
    @IsString({ message: 'Los apellidos del usuario deben ser un string' })
    @MaxLength(150, { message: 'Los apellidos del usuario no pueden exceder los 150 caracteres' })
    apellidos?: string;

    @ApiPropertyOptional({description: 'Email del usuario', example: 'usuario@gmail.com', maxLength: 150})
    @IsOptional()
    @IsEmail({}, { message: 'El email del usuario debe ser un email válido' })
    @MaxLength(150, { message: 'El email del usuario no puede exceder los 150 caracteres' })
    email?: string;

    @ApiPropertyOptional({ description: 'Contraseña del usuario', example: 'Password123!', minLength: 6, maxLength: 255})
    @IsOptional()
    @IsString({ message: 'La contraseña del usuario debe ser un string' })
    @MinLength(6, { message: 'La contraseña del usuario debe tener al menos 6 caracteres' })
    @MaxLength(255, { message: 'La contraseña del usuario no puede exceder los 255 caracteres' })
    password?: string;

    @ApiPropertyOptional({ description: 'DNI del usuario', example: '72637212T', maxLength: 20})
    @IsOptional()
    @IsString({ message: 'El DNI del usuario debe ser un string' })
    @MaxLength(20, { message: 'El DNI del usuario no puede exceder los 20 caracteres' })
    dni?: string;

    @ApiPropertyOptional({ description: 'Telefono del usuario', example: '192348563', maxLength: 20})
    @IsOptional()
    @IsString({ message: 'El teléfono del usuario debe ser un string' })
    @MaxLength(20, { message: 'El teléfono del usuario no puede exceder los 20 caracteres' })
    telefono?: string;

    @ApiPropertyOptional({ description: 'Indica si el usuario esta activo', example: false})
    @IsOptional()
    @IsBoolean({ message: 'El campo "activo" debe ser un booleano' })
    activo?: boolean;

    @ApiPropertyOptional({ description: 'ID del rol', example: 1})
    @IsOptional()
    @IsNumber({}, { message: 'El ID del rol debe ser un número' })
    rol_id?: number;

    @ApiPropertyOptional({ description: 'ID del tenant', example: 1})
    @IsOptional()
    @IsNumber({}, { message: 'El ID del tenant debe ser un número' })
    tenant_id?: number;

    @ApiPropertyOptional({ description: 'ID de la mesa', example: 1})
    @IsOptional()
    @IsNumber({}, { message: 'El ID de la mesa debe ser un número' })
    mesa_id?: number;
}