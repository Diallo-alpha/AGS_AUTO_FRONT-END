import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { SidbarComponent } from '../../sidbar/sidbar.component';
import { PartenaireService } from '../../../services/partenaire.service';
import { partenaire } from '../../../models/partenaireModel';
@Component({
  selector: 'app-list-partenaire',
  standalone: true,
  imports: [CommonModule, RouterModule, SidbarComponent],
  templateUrl: './list-partenaire.component.html',
  styleUrl: './list-partenaire.component.css'
})
export class ListPartenaireComponent implements OnInit {
  partenaires: partenaire[] = [];

  constructor(
    private partenaireService: PartenaireService,
    private router: Router
  ) {}

  ngOnInit() {
    this.chargerPartenaires();
  }

  chargerPartenaires() {
    this.partenaireService.getPartenaires().subscribe(
      (data) => {
        this.partenaires = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des partenaires', error);
      }
    );
  }

  ajouterPartenaire() {
    // Naviguer vers la page d'ajout de partenaire
    this.router.navigate(['/dashboard/partenaire/ajouter']);
  }

  editerPartenaire(id: number) {
    // Naviguer vers la page d'édition de partenaire
    this.router.navigate(['/dashboard/partenaire/modifier', id]); 
  }

  supprimerPartenaire(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) {
      this.partenaireService.deletePartenaire(id).subscribe(
        () => {
          this.chargerPartenaires(); // Recharger la liste après suppression
        },
        (error) => {
          console.error('Erreur lors de la suppression du partenaire', error);
        }
      );
    }
  }
}
