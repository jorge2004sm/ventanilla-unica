import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsNumber, IsBoolean } from "class-validator";

export class UpdateMesaDto {
    @ApiPropertyOptional({ description: 'Numero de la mesa', example: 1})
    @IsOptional()
    @IsNumber({}, { message: 'El número de la mesa debe ser un número' })
    numero?: number;

    @ApiPropertyOptional({ description: 'Indica si la mesa esta activa', example: false})
    @IsOptional()
    @IsBoolean({ message: 'El campo "activa" debe ser un booleano' })
    activa?: boolean;
}