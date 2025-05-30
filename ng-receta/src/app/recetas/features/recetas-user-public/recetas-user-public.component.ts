import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RecetasService, Receta } from '../../data-access/recetas.service';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-recetas-user-public',
  standalone: true,
  templateUrl: './recetas-user-public.component.html',
  styleUrl: './recetas-user-public.component.scss',
  providers: [RecetasService],
  imports: [CommonModule, RouterLink],
})
export default class RecetasUserPublicComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private recetaService = inject(RecetasService);

  userId = signal<string | null>(null);
  recetas = signal<Receta[]>([]);
  cargando = signal<boolean>(true);

 ngOnInit() {
  const id = this.route.snapshot.paramMap.get('userId');
  if (id) {
    this.userId.set(id);
    this.recetaService.getRecetasPublicasDeUsuario(id).subscribe((recetas) => {
      this.recetas.set(recetas);
      this.cargando.set(false);
    });
  }
}

}
