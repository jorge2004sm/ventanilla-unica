import { Cita } from "./cita.model";
import { Documento } from "./documento.model";
import { EstadoTramite } from "./enums/estado-tramite.enum";
import { TipoTramite } from "./tipo-tramite.model";

export interface Tramite{
    id: number;
    estado: EstadoTramite;
    observaciones?: string;
    tipoTramite: TipoTramite;
    cita: Cita;
    documentos?: Documento[];
    created_at: string;
    updated_at: string;
}