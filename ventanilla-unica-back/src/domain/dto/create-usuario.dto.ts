import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, MaxLength, IsEmail, MinLength, IsOptional, IsNumber } from "class-validator";

export class CreateUsuarioDto {

    @ApiProperty({ description: 'Nombre del usuario', example: 'Jorge', maxLength: 100})
    @IsString({ message: 'El nombre debe ser un string' })
    @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
    nombre: string;

    @ApiProperty({ description: 'Apellidos del usuario', example: 'Rodriguez Perez', maxLength: 150})
    @IsString({ message: 'Los apellidos deben ser un string' })
    @MaxLength(150, { message: 'Los apellidos no pueden exceder los 150 caracteres' })
    apellidos: string;

    @ApiProperty({ description: 'Email del usuario', example: 'jorgesanchez@gmail.com', maxLength: 150})
    @IsEmail({}, { message: 'El email debe ser un email válido' })
    @MaxLength(150, { message: 'El email no puede exceder los 150 caracteres' })
    email: string;

    @ApiProperty({ description: 'Contraseña del usuario', example: 'Contraseña!123', maxLength: 255, minLength: 6})
    @IsString({ message: 'La contraseña debe ser un string' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    @MaxLength(255, { message: 'La contraseña no puede exceder los 255 caracteres' })
    password: string;

    @ApiPropertyOptional({ description: 'DNI del usuario', example: '19823462G', maxLength: 20})
    @IsOptional()
    @IsString({ message: 'El DNI debe ser un string' })
    @MaxLength(20, { message: 'El DNI no puede exceder los 20 caracteres' })
    dni?: string;

    @ApiPropertyOptional({ description: 'Telefono del usuario', example: '671829900', maxLength: 20})
    @IsOptional()
    @IsString({ message: 'El teléfono debe ser un string' })
    @MaxLength(20, { message: 'El teléfono no puede exceder los 20 caracteres' })
    telefono?: string;

    @ApiProperty({description: 'ID del rol del usuario', example: 1})
    @IsNumber({}, { message: 'El ID del rol debe ser un número' })
    rol_id: number;

    @ApiPropertyOptional({ description: 'ID del tenant', example: 1})
    @IsOptional()
    @IsNumber({}, { message: 'El ID del tenant debe ser un número' })
    tenant_id?: number;

    @ApiPropertyOptional({ description: 'ID de la mesa', example: 1})
    @IsOptional()
    @IsNumber({}, { message: 'El ID de la mesa debe ser un número' })
    mesa_id?: number;

}