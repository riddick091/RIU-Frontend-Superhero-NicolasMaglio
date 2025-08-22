import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Dashboard } from './features/dashboard/dashboard';
import {
    Login
} from './features/auth/login/login';

export const routes: Routes = [

    {
        path: 'dashboard', component: Dashboard, pathMatch: 'full', canActivate: [authGuard]
    },
    { path: 'login', component: Login },
    {
        path: 'heros',
        loadChildren: () => import('./features/heros/hero.routes').then(m => m.routes),
        canActivate: [authGuard]
    },
    { path: '**', redirectTo: '/dashboard' }
];
