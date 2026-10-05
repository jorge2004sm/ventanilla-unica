import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Max, MaxLength } from "class-validator";

export class CreateDocumentoDto {

    @ApiProperty({ description: 'El nombre del archivo', example: 'documento.pdf', maxLength: 255 })
    @IsString({ message: 'El nombre del archivo debe ser un string' })
    @MaxLength(255, { message: 'El nombre del archivo no puede exceder los 255 caracteres' })
    nombre_archivo: string;

    @ApiProperty({ description: 'La ruta del archivo', example: '/uploads/documento.pdf', maxLength: 500 })
    @IsString({ message: 'La ruta del archivo debe ser un string' })
    @MaxLength(500, { message: 'La ruta del archivo no puede exceder los 500 caracteres' })
    ruta_archivo: string;

    @ApiProperty({ description: 'El ID del trámite al que pertenece el documento', example: 1 })
    @IsNumber({}, { message: 'El ID del trámite debe ser un número' })
    tramite_id: number;
}