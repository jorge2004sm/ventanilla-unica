import { Tenant } from "./tenant.model";

export interface Sala {
    id: number;
    nombre: string;
    descripcion?: string;
    activa: boolean;
    tenant: Tenant;
    created_at: string;
    updated_at: string;
}