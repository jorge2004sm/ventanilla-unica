import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { AuthUser, LoginResponse } from "../models";

const TOKEN_KEY = 'vu_token';
const USER_KEY = 'vu_user';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);

    private readonly _user = signal<AuthUser | null>(this.readUserFromStorage());
    readonly user = this._user.asReadonly();
    readonly isLoggedIn = computed(() => this._user() != null);

    login(email: string, password: string): Observable<LoginResponse> {
        return this.http
            .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password })
            .pipe(tap((res) => this.persistSession(res)));
    }


    registro(datos: {
        nombre: string;
        apellidos: string;
        email: string;
        password: string;
        dni?: string;
        telefono?: string;
    }): Observable<LoginResponse> {
        return this.http
            .post<LoginResponse>(`${environment.apiUrl}/auth/registro`, datos)
            .pipe(tap((res) => this.persistSession(res)));
    }

    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        this._user.set(null);
        this.router.navigate(['/']);
    }

    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    hasRole(rol: string): boolean {
        return this._user()?.rol === rol;
    }

    private persistSession(res: LoginResponse): void {
        localStorage.setItem(TOKEN_KEY, res.access_token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.usuario));
        this._user.set(res.usuario);
    }

    private readUserFromStorage(): AuthUser | null {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    }
    // Método adicional para obtener el tenantId del usuario autenticado
    getTenantId(): number | null {
        return this._user()?.tenantId ?? null;
    }
}