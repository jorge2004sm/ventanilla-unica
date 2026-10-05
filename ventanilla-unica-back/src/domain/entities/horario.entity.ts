import { DiaSemana } from "../enums/dia-semana.enum";
import { TipoHorario } from "../enums/tipo-horario.enum";
import { Tenant } from "./tenant.entity";

export class Horario{
    id: number;
    tipo: TipoHorario;
    dia_semana?: DiaSemana;
    fecha_inicio?: Date;
    fecha_fin?: Date;
    hora_inicio: string;
    hora_fin: string;
    duracion_cita: number;
    es_festivo: boolean;
    descripcion?: string;
    activo: boolean;
    tenant: Tenant;
    created_at: Date;
    updated_at: Date;
}