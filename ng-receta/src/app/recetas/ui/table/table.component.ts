import { Component, effect, inject, input } from '@angular/core';
import { Receta, RecetasService } from '../../data-access/recetas.service';
import { RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-table',
  imports: [RouterLink],
  templateUrl: './table.component.html',
})
export class TableComponent {

    private _recetaService = inject(RecetasService);


recetas = input.required<Receta[]>();


async deleteReceta(id: string) {
    await this._recetaService.delete(id);

    toast.success('Receta eliminada');
  }


}
