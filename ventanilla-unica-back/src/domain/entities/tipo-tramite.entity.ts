import { Tenant } from "./tenant.entity";

export class TipoTramite {
    id: number;
    nombre: string;
    descripcion?: string;
    requisitos_documentos?: string;
    tenant: Tenant;
    activo: boolean;
    created_at: Date;
    updated_at: Date;
}