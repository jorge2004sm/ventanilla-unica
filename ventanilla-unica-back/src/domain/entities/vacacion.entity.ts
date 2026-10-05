import { EstadoVacacion } from "../enums/estado-vacacion.enum";
import { TipoVacacion } from "../enums/tipo-vacacion.enum";
import { Usuario } from "./usuario.entity";

export class Vacacion{
    id: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    tipo: TipoVacacion;
    estado: EstadoVacacion;
    motivo?: string;
    aprobadoPor?: Usuario;
    usuario: Usuario;
    created_at: Date;
    updated_at: Date;
}