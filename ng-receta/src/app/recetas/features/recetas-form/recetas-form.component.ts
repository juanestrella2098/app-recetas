import {
  AfterViewInit,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Receta,
  RecetaCreate,
  RecetasService,
} from '../../data-access/recetas.service';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recetas-form',
  imports: [ReactiveFormsModule],
  templateUrl: './recetas-form.component.html',
  styleUrl: './recetas-form.component.scss',
  providers: [RecetasService]
})
export default class RecetasFormComponent {
  private _formBuilder = inject(FormBuilder);
  private _recetaService = inject(RecetasService);
  private _router = inject(Router);

  loading = signal(false);

  idReceta = input.required<string>();

  form = this._formBuilder.group({
    title: this._formBuilder.control('', Validators.required),
    completed: this._formBuilder.control(false, Validators.required),
  });

  constructor() {
    effect(() => {
      const id = this.idReceta();
      if (id) {
        this.getReceta(id);
      }
    });
  }

  async submit() {
    if (this.form.invalid) return;

    try {
      this.loading.set(true);
      const { title, completed } = this.form.value;
      const receta: RecetaCreate = {
        title: title || '',
        completed: !!completed,
      };

      const id = this.idReceta();
      if (id) {
        await this._recetaService.update(receta, id);
      } else {
        await this._recetaService.create(receta);
      }

      toast.success(`Receta ${id ? 'actualizada' : 'creada'} correctamente`);
      this._router.navigateByUrl('/recetas');
    } catch (error) {
      toast.success('Ocurrio un problema');
    } finally {
      this.loading.set(false);
    }
  }

  async getReceta(id: string) {
    const recetaSnapshopt = await this._recetaService.getReceta(id);

    if (!recetaSnapshopt.exists()) return;

    const receta = recetaSnapshopt.data() as Receta;

    this.form.patchValue(receta);
  }

  
}
