import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                loadComponent: () => import('./hero-list/hero-list').then(m => m.HeroList)
            },
        ],
    }
];
