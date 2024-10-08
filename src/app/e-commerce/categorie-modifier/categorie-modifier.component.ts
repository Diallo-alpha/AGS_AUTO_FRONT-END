import { Component } from '@angular/core';
import { SidbarComponent } from '../../dashboard/sidbar/sidbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categorie-modifier',
  standalone: true,
  imports: [SidbarComponent, RouterModule, CommonModule],
  templateUrl: './categorie-modifier.component.html',
  styleUrl: './categorie-modifier.component.css'
})
export class CategorieModifierComponent {

}
