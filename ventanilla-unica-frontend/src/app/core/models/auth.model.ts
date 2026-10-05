export interface LoginResponse {
    access_token: string;
    usuario: AuthUser;
}


export interface AuthUser {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
    rol: string;
    tenantId: number | null;
    tenant_nombre: string | null;
}