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
  providers: [RecetasService],
})
export default class RecetasFormComponent {
  private _formBuilder = inject(FormBuilder);
  private _recetaService = inject(RecetasService);
  private _router = inject(Router);

  loading = signal(false);

  idReceta = input.required<string>();

  form = this._formBuilder.group({
  titulo: this._formBuilder.control('', Validators.required),
  descripcion: this._formBuilder.control('', Validators.required),
  ingredientes: this._formBuilder.control<string[]>([], Validators.required),
  pasos: this._formBuilder.control<string[]>([], Validators.required),
  publico: this._formBuilder.control(false, Validators.required),
  nivelDificultad: this._formBuilder.control<'fácil' | 'media' | 'difícil'>('fácil', Validators.required),
  tiempoElaboracion: this._formBuilder.control<number>(0, [Validators.required, Validators.min(1)]),
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
      const {
        titulo,
        descripcion,
        ingredientes,
        pasos,
        publico,
        nivelDificultad,
        tiempoElaboracion,
      } = this.form.value;

      const receta: RecetaCreate = {
        titulo: titulo || '',
        descripcion: descripcion || '',
        ingredientes: ingredientes || [],
        pasos: pasos || [],
        publico: !!publico,
        nivelDificultad: nivelDificultad || 'fácil',
        tiempoElaboracion: tiempoElaboracion || 0,
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
      toast.error('Ocurrió un problema');
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

  onIngredientesInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const ingredientes = input.value.split(',').map(i => i.trim());
  this.form.controls['ingredientes'].setValue(ingredientes);
}

onPasosInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const pasos = input.value.split(',').map(p => p.trim());
  this.form.controls['pasos'].setValue(pasos);
}


}
