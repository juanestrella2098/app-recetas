import { Routes } from "@angular/router";

export default [
    {
        path: '',
        loadComponent: () => import('./recetas-list/recetas-list.component')
    },
    {
        path: 'new',
        loadComponent: () => import('./recetas-form/recetas-form.component')
    },
    
    {
        path: 'edit/:idReceta',
        loadComponent: () => import('./recetas-form/recetas-form.component')
    }
] as Routes