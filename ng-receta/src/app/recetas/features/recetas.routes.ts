import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./recetas-list/recetas-list.component'),
  },
  {
    path: 'new',
    loadComponent: () => import('./recetas-form/recetas-form.component'),
  },

  {
    path: 'edit/:idReceta',
    loadComponent: () => import('./recetas-form/recetas-form.component'),
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./receta-view/receta-view.component'),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./recetas-search-page/recetas-search-page.component'),
  },
  {
    path: 'search/results',
    loadComponent: () =>
      import('./recetas-search-results/recetas-search-results.component'),
  },
  {
    path: 'show/users',
    loadComponent: () => import('./recetas-users/recetas-users.component'),
  },
  {
    path: 'show/user/:userId',
    loadComponent: () =>
      import('./recetas-user-public/recetas-user-public.component'),
  },
] as Routes;
