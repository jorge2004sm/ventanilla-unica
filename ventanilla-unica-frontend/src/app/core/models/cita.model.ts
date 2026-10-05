import { EstadoCita } from "./enums/estado-cita.enum";
import { Tenant } from "./tenant.model";
import { Tramite } from "./tramite.model";
import { Usuario } from "./usuario.model";

export interface Cita{
    id: number;
    ciudadano_nombre: string;
    ciudadano_apellidos: string;
    ciudadano_email: string;
    ciudadano_dni: string;
    ciudadano_telefono: string;

    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    estado: EstadoCita;
    observaciones?: string;
    empleado: Usuario;
    ciudadano?: Usuario;
    tenant: Tenant;
    tramite?: Tramite;
    created_at: string;
    updated_at: string;
}