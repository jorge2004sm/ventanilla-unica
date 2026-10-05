import { DiaSemana } from "./enums/dia-semana.enum";
import { TipoHorario } from "./enums/tipo-horario.enum";
import { Tenant } from "./tenant.model";

export interface Horario{
    id: number;
    tipo: TipoHorario;
    dia_semana?: DiaSemana;
    fecha_inicio?: string;
    fecha_fin?: string;
    hora_inicio: string;
    hora_fin: string;
    duracion_cita: number;
    es_festivo: boolean;
    descripcion?: string;
    activo: boolean;
    tenant: Tenant;
    created_at: string;
    updated_at: string;
}