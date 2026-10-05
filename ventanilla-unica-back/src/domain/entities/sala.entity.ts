import { Tenant } from "./tenant.entity";

export class Sala {
    id: number;
    nombre: string;
    descripcion?: string;
    activa: boolean;
    tenant: Tenant;
    created_at: Date;
    updated_at: Date;
}