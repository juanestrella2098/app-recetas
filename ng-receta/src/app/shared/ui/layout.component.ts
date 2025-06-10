import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthStateService } from '../data-access/auth-state.service';

@Component({
  standalone: true,
  imports: [RouterModule, RouterLink],
  selector: 'app-layout',
  template: `
    <header class="h-[80px] mb-8 w-full max-w-screen-lg mx-auto px-4">
      <nav class="flex items-center justify-between h-full">
        <div class="flex items-center gap-4">
          <a class="text-2xl font-bold" routerLink="/recetas">Recetitas</a>
          <a
            routerLink="/recetas/search"
            class="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 rounded-lg px-4 py-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
          >
            Buscar Recetas
          </a>
          <a
            routerLink="/recetas/show/users"
            class="text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 rounded-lg px-4 py-2 dark:bg-purple-500 dark:hover:bg-purple-600 dark:focus:ring-purple-800"
          >
            Usuarios
          </a>
        </div>
        <button
          type="button"
          class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          (click)="logOut()"
        >
          Salir
        </button>
      </nav>
    </header>
    <router-outlet />
  `,
})
export default class LayoutComponent {
  private _authState = inject(AuthStateService);
  private _router = inject(Router);

  async logOut() {
    await this._authState.logOut();
    this._router.navigateByUrl('/auth/sign-in');
  }
}