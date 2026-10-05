import { Tramite } from "./tramite.model";

export interface Documento{
    id: number;
    nombre_archivo: string;
    ruta_archivo: string;
    tramite: Tramite;
    created_at: string;
}