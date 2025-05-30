import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Receta, RecetasService } from '../../data-access/recetas.service';
import { AuthStateService } from '../../../shared/data-access/auth-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recetas-search-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recetas-search-page.component.html',
  styleUrl: './recetas-search-page.component.scss',
  providers: [RecetasService],
})
export default class RecetasSearchPageComponent {
  private recetaService = inject(RecetasService);
  private authState = inject(AuthStateService);
  private router = inject(Router); // ✅ Inyección correcta del Router

  filtros = {
    titulo: '',
    ingredientes: '',
    nivelDificultad: '',
    tiempoElaboracion: null as number | null,
    valoracion: null as number | null,
  };

  recetasFiltradas = signal<Receta[]>([]);
  cargando = signal<boolean>(false);

  buscarRecetas() {
    this.cargando.set(true);
    const userIdActual = this.authState.currentUser?.uid;

    const recetas = this.recetaService.getRecetasPublicas();
    const ingredientesFiltro = this.filtros.ingredientes
      .split(',')
      .map((i) => i.trim().toLowerCase())
      .filter((i) => i);

    const resultados = recetas
      .filter((receta) => receta.userId !== userIdActual)
      .filter((receta) => {
        const coincideTitulo = this.filtros.titulo
          ? receta.titulo
              .toLowerCase()
              .includes(this.filtros.titulo.toLowerCase())
          : false;

        const coincideIngredientes = ingredientesFiltro.length
          ? receta.ingredientes.some((ing) =>
              ingredientesFiltro.includes(ing.toLowerCase())
            )
          : false;

        const coincideDificultad = this.filtros.nivelDificultad
          ? receta.nivelDificultad === this.filtros.nivelDificultad
          : false;

        const coincideTiempo =
          this.filtros.tiempoElaboracion !== null
            ? receta.tiempoElaboracion <= this.filtros.tiempoElaboracion
            : false;

        const coincideValoracion =
          this.filtros.valoracion !== null
            ? receta.valoracion >= this.filtros.valoracion
            : false;

        return (
          coincideTitulo ||
          coincideIngredientes ||
          coincideDificultad ||
          coincideTiempo ||
          coincideValoracion
        );
      });

    this.recetasFiltradas.set(resultados);
    localStorage.setItem('recetasFiltradas', JSON.stringify(resultados));
    this.cargando.set(false);

    this.router.navigate(['/recetas/search/results']);
  }
}
