import { Component } from '@angular/core';
import { SidbarComponent } from '../../dashboard/sidbar/sidbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-categorie-ajouter',
  standalone: true,
  imports: [SidbarComponent, CommonModule, RouterModule],
  templateUrl: './categorie-ajouter.component.html',
  styleUrl: './categorie-ajouter.component.css'
})
export class CategorieAjouterComponent {

}
