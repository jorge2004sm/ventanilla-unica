export class Tenant {
    id: number;
    nombre: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    activo: boolean;
    created_at: Date;
    updated_at: Date;
}