import { Component } from '@angular/core';
import { SidbarComponent } from '../../dashboard/sidbar/sidbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-produit-ajouter',
  standalone: true,
  imports: [SidbarComponent, CommonModule, RouterModule],
  templateUrl: './produit-ajouter.component.html',
  styleUrl: './produit-ajouter.component.css'
})
export class ProduitAjouterComponent {

}
