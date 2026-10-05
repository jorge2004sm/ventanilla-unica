import { Tramite } from "./tramite.entity";

export class Documento{
    id: number;
    nombre_archivo: string;
    ruta_archivo: string;
    tramite: Tramite;
    created_at: Date;
}