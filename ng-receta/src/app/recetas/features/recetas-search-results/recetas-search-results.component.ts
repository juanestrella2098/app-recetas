import { Component, signal } from '@angular/core';
import { Receta } from '../../data-access/recetas.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recetas-search-results',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './recetas-search-results.component.html',
  styleUrl: './recetas-search-results.component.scss',
})
export default class RecetasSearchResultsComponent {
  recetas = signal<Receta[]>([]);
  cargando = signal<boolean>(true);

  constructor() {
    const data = localStorage.getItem('recetasFiltradas');
    if (data) {
      this.recetas.set(JSON.parse(data));
    }
    this.cargando.set(false);
  }
}
