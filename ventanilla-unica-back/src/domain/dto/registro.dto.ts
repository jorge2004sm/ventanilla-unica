import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class RegistroDto {

    @ApiProperty({ description: 'Nombre del ciudadano', example: 'Jorge', maxLength: 100 })
    @IsString({ message: 'El nombre debe ser un string' })
    @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
    nombre: string;

    @ApiProperty({ description: 'Apellidos del ciudadano', example: 'Rodriguez Perez', maxLength: 150 })
    @IsString({ message: 'Los apellidos deben ser un string' })
    @MaxLength(150, { message: 'Los apellidos no pueden exceder los 150 caracteres' })
    apellidos: string;

    @ApiProperty({ description: 'Email del ciudadano', example: 'jorgesanchez@gmail.com', maxLength: 150 })
    @IsEmail({}, { message: 'El email debe ser un email válido' })
    @MaxLength(150, { message: 'El email no puede exceder los 150 caracteres' })
    email: string;

    @ApiProperty({ description: 'Contraseña', example: 'Contraseña!123', minLength: 6, maxLength: 255 })
    @IsString({ message: 'La contraseña debe ser un string' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    @MaxLength(255, { message: 'La contraseña no puede exceder los 255 caracteres' })
    password: string;

    @ApiPropertyOptional({ description: 'DNI del ciudadano', example: '19823462G', maxLength: 20 })
    @IsOptional()
    @IsString({ message: 'El DNI debe ser un string' })
    @MaxLength(20, { message: 'El DNI no puede exceder los 20 caracteres' })
    dni?: string;

    @ApiPropertyOptional({ description: 'Teléfono del ciudadano', example: '671829900', maxLength: 20 })
    @IsOptional()
    @IsString({ message: 'El teléfono debe ser un string' })
    @MaxLength(20, { message: 'El teléfono no puede exceder los 20 caracteres' })
    telefono?: string;
}