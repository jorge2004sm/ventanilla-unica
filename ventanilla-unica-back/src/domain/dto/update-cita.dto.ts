import { IsOptional, IsEnum, IsString, IsNumber } from "class-validator";
import { EstadoCita } from "../enums/estado-cita.enum";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateCitaDto {
    @ApiPropertyOptional({description: 'Estado de la cita', example: 'PENDIENTE'})
    @IsOptional()
    @IsEnum(EstadoCita, { message: 'El estado de la cita debe ser un valor válido' })
    estado?: EstadoCita;

    @ApiPropertyOptional({ description: 'Observaciones de la cita', example: 'Observacion sobre la cita'})
    @IsOptional()
    @IsString({ message: 'Las observaciones deben ser un string' })
    observaciones?: string;

    @ApiPropertyOptional({ description: 'ID del empleado', example: 1})
    @IsOptional()
    @IsNumber({}, { message: 'El ID del empleado debe ser un número' })
    empleado_id?: number;
}