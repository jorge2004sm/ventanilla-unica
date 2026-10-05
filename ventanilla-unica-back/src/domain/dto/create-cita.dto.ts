import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, MaxLength, IsEmail, IsDateString, IsNumber, IsOptional } from "class-validator";

export class CreateCitaDto {

    @ApiProperty({ description: 'El nombre del ciudadano', example: 'Juan', maxLength: 100 })
    @IsString({ message: 'El nombre del ciudadano debe ser un string' })
    @MaxLength(100 , { message: 'El nombre del ciudadano no puede exceder los 100 caracteres' })
    ciudadano_nombre: string;

    @ApiProperty({ description: 'Los apellidos del ciudadano', example: 'Pérez García', maxLength: 150 })
    @IsString({ message: 'Los apellidos del ciudadano deben ser un string' })
    @MaxLength(150, { message: 'Los apellidos del ciudadano no pueden exceder los 150 caracteres' })
    ciudadano_apellidos: string;

    @ApiProperty({ description: 'El correo electrónico del ciudadano', example: 'juan.perez@google.com', maxLength: 150 })
    @IsEmail({}, { message: 'El correo electrónico del ciudadano debe ser válido' })
    @MaxLength(150, { message: 'El correo electrónico del ciudadano no puede exceder los 150 caracteres' })
    ciudadano_email: string;

    @ApiProperty({ description: 'El DNI del ciudadano', example: '12345678A', maxLength: 20 })
    @IsString({ message: 'El DNI del ciudadano debe ser un string' })
    @MaxLength(20, { message: 'El DNI del ciudadano no puede exceder los 20 caracteres' })
    ciudadano_dni: string;

    @ApiProperty({ description: 'El teléfono del ciudadano', example: '600123456', maxLength: 20 })
    @IsString({ message: 'El teléfono del ciudadano debe ser un string' })
    @MaxLength(20, { message: 'El teléfono del ciudadano no puede exceder los 20 caracteres' })
    ciudadano_telefono: string;

    @ApiProperty({ description: 'La fecha de la cita', example: '2024-12-31' })
    @IsDateString({}, { message: 'La fecha debe ser una fecha válida' })
    fecha: string;

    @ApiProperty({ description: 'La hora de inicio de la cita', example: '09:00' })
    @IsString({ message: 'La hora de inicio debe ser un string' })
    hora_inicio: string;

    @ApiProperty({ description: 'La hora de fin de la cita', example: '09:30' })
    @IsString({ message: 'La hora de fin debe ser un string' })
    hora_fin: string;

    @ApiProperty({ description: 'El ID del empleado', example: 1 })
    @IsOptional()
    @IsNumber({}, { message: 'El ID del empleado debe ser un número' })
    empleado_id: number;

    @ApiPropertyOptional({ description: 'El ID del ciudadano', example: 1 })
    @IsOptional()
    @IsNumber({}, { message: 'El ID del ciudadano debe ser un número' })
    ciudadano_id?: number;

    @ApiProperty({ description: 'El ID del tenant', example: 1 })
    @IsNumber({}, { message: 'El ID del tenant debe ser un número' })
    tenant_id: number;

    @ApiProperty({ description: 'El ID del tipo de trámite', example: 1 })
    @IsNumber({}, { message: 'El ID del tipo de trámite debe ser un número' })
    tipo_tramite_id: number;
}