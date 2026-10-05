import { Mesa } from "./mesa.entity";
import { Rol } from "./rol.entity";
import { Tenant } from "./tenant.entity";

export class Usuario {
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
    created_at: Date;   
    updated_at: Date;
}