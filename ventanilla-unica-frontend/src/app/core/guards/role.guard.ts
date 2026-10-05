import { inject } from "@angular/core"
import { AuthService } from "../services/auth.service"
import { CanActivateFn, Router } from "@angular/router";

export const roleGuard: CanActivateFn = (route) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const rolesPermitidos = (route.data?.['roles'] as string[]) ?? [];
    const user = auth.user();

    if(!user){
        router.navigate(['/login']);
        return false;
    }

    if(rolesPermitidos.includes(user.rol)){
        return true;
    }

    router.navigate(['/'])
    return false;
}