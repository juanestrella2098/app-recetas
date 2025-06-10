import { Component, inject } from '@angular/core';
import { TableComponent } from '../../ui/table/table.component';
import { Router, RouterLink } from '@angular/router';
import { RecetasService } from '../../data-access/recetas.service';

@Component({
  selector: 'app-recetas-list',
  imports: [TableComponent, RouterLink],
  templateUrl: './recetas-list.component.html',
  providers: [RecetasService]
})
export default class RecetasListComponent {

   recetasService = inject(RecetasService);
}