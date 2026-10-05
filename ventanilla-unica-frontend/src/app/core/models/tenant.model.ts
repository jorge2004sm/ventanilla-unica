export interface Tenant {
    id: number;
    nombre: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    activo: boolean;
    created_at: string;
    updated_at: string;
}
    