import { inject } from '@angular/core';
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from '../services/auth/auth';

export const authGuard: CanActivateFn = () => {

    const authService = inject(AuthService);
    const router = inject(Router)

    const isAuth = authService.checkUserAuthenticated()

    if (isAuth) {
        return true
    }   

    return router.createUrlTree(['/login']);
};
