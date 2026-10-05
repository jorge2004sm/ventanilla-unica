import { EstadoVacacion } from "./enums/estado-vacacion.enum";
import { TipoVacacion } from "./enums/tipo-vacacion.enum";
import { Usuario } from "./usuario.model";

export interface Vacacion{
    id: number;
    fecha_inicio: string;
    fecha_fin: string;
    tipo: TipoVacacion;
    estado: EstadoVacacion;
    motivo?: string;
    aprobadoPor?: Usuario;
    usuario: Usuario;
    created_at: string;
    updated_at: string;
}