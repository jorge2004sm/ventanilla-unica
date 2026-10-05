import { Mesa } from "./mesa.model";
import { Rol } from "./rol.model";
import { Tenant } from "./tenant.model";

export interface Usuario {
    id: number;
    nombre: string;
    apellidos: string;  
    email: string;
    password: string;
    dni?: string;
    telefono?: string;
    activo: boolean;
    rol: Rol;
    mesa?: Mesa;
    tenant?: Tenant;
    created_at: string;   
    updated_at: string;
}