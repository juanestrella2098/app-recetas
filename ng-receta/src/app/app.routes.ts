import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from './core/auth.guard';

export const routes: Routes = [
    {
        canActivateChild: [publicGuard()],
        path: 'auth',
        loadChildren: () => import('./auth/features/auth.routes')

    },
    {
        canActivateChild: [privateGuard()],
        path: 'recetas',
        loadComponent: () => import('./shared/ui/layout.component'),
        loadChildren: () => import('./recetas/features/recetas.routes')
    },
    {
        path: '**',
        redirectTo: '/recetas'
    }
];
