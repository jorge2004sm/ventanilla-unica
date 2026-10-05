import { Tenant } from "./tenant.model";

export interface TipoTramite {
    id: number;
    nombre: string;
    descripcion?: string;
    requisitos_documentos?: string;
    tenant: Tenant;
    activo: boolean;
    created_at: string;
    updated_at: string;
}