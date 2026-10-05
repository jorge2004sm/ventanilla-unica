import { EstadoTramite } from "../enums/estado-tramite.enum";
import { Cita } from "./cita.entity";
import { TipoTramite } from "./tipo-tramite.entity";

export class Tramite{
    id: number;
    estado: EstadoTramite;
    observaciones?: string;
    tipoTramite: TipoTramite;
    cita: Cita;
    created_at: Date;
    updated_at: Date;
}