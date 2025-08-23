import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Dashboard } from './features/dashboard/dashboard';
import {
    Login
} from './features/auth/login/login';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthLayout,
        children: [
            { path: 'login', component: Login },
            { path: '', redirectTo: 'login', pathMatch: 'full' }
        ]
    },
    {
        path: '',
        component: MainLayout,
        children: [
            { path: 'dashboard', component: Dashboard },
            {
                path: 'heros',
                loadChildren: () => import('./features/heros/hero.routes').then(m => m.routes),
            },
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
        ],
        canActivate: [authGuard]
    },

    { path: '**', redirectTo: '/auth/login' }
];
