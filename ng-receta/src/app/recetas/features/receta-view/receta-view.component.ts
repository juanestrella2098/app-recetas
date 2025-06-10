import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RecetasService, Receta } from '../../data-access/recetas.service';
import { FormsModule } from '@angular/forms';
import { AuthStateService } from '../../../shared/data-access/auth-state.service';

@Component({
  selector: 'app-receta-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './receta-view.component.html',
  styleUrl: './receta-view.component.scss',
  providers: [RecetasService],
})
export default class RecetaViewComponent {
  private route = inject(ActivatedRoute);
  private recetaService = inject(RecetasService);
  private authState = inject(AuthStateService);

  receta = signal<Receta | null>(null);
  nuevoComentario = '';

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadReceta(id);
    }
  }

  async loadReceta(id: string) {
    const snapshot = await this.recetaService.getReceta(id);
    if (snapshot.exists()) {
      const data = snapshot.data() as Receta;
      this.receta.set({ ...data, id });
    }
  }

  async agregarComentario(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    const recetaActual = this.receta();
    if (!recetaActual || !recetaActual.id || !this.nuevoComentario.trim())
      return;

    const nuevoComentario = this.nuevoComentario.trim();

    const comentariosActualizados = Array.isArray(recetaActual.comentarios)
      ? [...recetaActual.comentarios, nuevoComentario]
      : [nuevoComentario];

    await this.recetaService.updateComentarios(
      recetaActual.id,
      comentariosActualizados
    );

    this.receta.set({
      ...recetaActual,
      comentarios: comentariosActualizados,
    });

    this.nuevoComentario = '';
  }

  get esDelUsuarioActual(): boolean {
    const recetaActual = this.receta();
    return recetaActual?.userId === this.authState.currentUser?.uid;
  }

  async copiarReceta() {
    const recetaActual = this.receta();
    if (!recetaActual) return;

    const recetaParaCopiar = {
      titulo: recetaActual.titulo,
      descripcion: recetaActual.descripcion,
      ingredientes: recetaActual.ingredientes,
      pasos: recetaActual.pasos,
      publico: recetaActual.publico,
      nivelDificultad: recetaActual.nivelDificultad,
      tiempoElaboracion: recetaActual.tiempoElaboracion,
      totalVotos: 0,
      totalPuntos: 0,
    };

    await this.recetaService.create(recetaParaCopiar);
    alert('Receta copiada a tu cuenta.');
  }

  async votar(puntuacion: number) {
    const recetaActual = this.receta();
    if (!recetaActual || this.esDelUsuarioActual) return;

    await this.recetaService.votarReceta(recetaActual.id, puntuacion);
    await this.loadReceta(recetaActual.id); // Recargar receta actualizada
  }
}