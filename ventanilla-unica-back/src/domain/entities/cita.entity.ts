import { EstadoCita } from "../enums/estado-cita.enum";
import { Tenant } from "./tenant.entity";
import { Usuario } from "./usuario.entity";

export class Cita{
    id: number;
    ciudadano_nombre: string;
    ciudadano_apellidos: string;
    ciudadano_email: string;
    ciudadano_dni: string;
    ciudadano_telefono: string;

    fecha: Date;
    hora_inicio: string;
    hora_fin: string;
    estado: EstadoCita;
    observaciones?: string;
    empleado: Usuario;
    ciudadano?: Usuario;
    tenant: Tenant;
    created_at: Date;
    updated_at: Date;
}