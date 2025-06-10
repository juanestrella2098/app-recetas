import { Component, signal, inject, OnInit } from '@angular/core';
import { RecetasService, Usuario } from '../../data-access/recetas.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthStateService } from '../../../shared/data-access/auth-state.service';

@Component({
  selector: 'app-recetas-users',
  standalone: true,
  templateUrl: './recetas-users.component.html',
  styleUrl: './recetas-users.component.scss',
  imports: [RouterLink, CommonModule],
  providers: [RecetasService],
})
export default class RecetasUsersComponent implements OnInit {
  private recetaService = inject(RecetasService);
  private authState = inject(AuthStateService);

  usuarios = signal<Usuario[]>([]);
  cargando = signal<boolean>(true);

  ngOnInit() {
    const currentUid = this.authState.currentUser?.uid;

    this.recetaService.getUsuarios().subscribe((usuarios) => {
      const filtrados = usuarios.filter((u) => u.uid !== currentUid);
      this.usuarios.set(filtrados);
      this.cargando.set(false);
    });
  }
}