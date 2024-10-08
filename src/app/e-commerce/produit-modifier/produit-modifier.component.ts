import { Component } from '@angular/core';
import { SidbarComponent } from '../../dashboard/sidbar/sidbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-produit-modifier',
  standalone: true,
  imports: [SidbarComponent, CommonModule, RouterModule],
  templateUrl: './produit-modifier.component.html',
  styleUrl: './produit-modifier.component.css'
})
export class ProduitModifierComponent {

}
