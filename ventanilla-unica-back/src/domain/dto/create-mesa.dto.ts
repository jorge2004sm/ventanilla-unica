import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreateMesaDto{

    @ApiProperty({ description: 'El número de la mesa', example: 1 })
    @IsNumber({}, { message: 'El número de la mesa debe ser un número' })
    numero: number;

    @ApiProperty({ description: 'El ID de la sala', example: 1 })
    @IsNumber({}, { message: 'El ID de la sala debe ser un número' })
    sala_id: number;
}