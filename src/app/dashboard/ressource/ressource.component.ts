import { Component, OnInit } from '@angular/core';
import { SidbarComponent } from '../sidbar/sidbar.component';
import { RessourceService } from '../../services/ressource.service';
import { Ressource } from '../../models/ressourceModel';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-ressource',
  standalone:true,
  imports: [SidbarComponent, CommonModule, RouterModule],
  templateUrl: './ressource.component.html',
  styleUrl: './ressource.component.css'
})
export class RessourceComponent implements OnInit {
  ressources: Ressource[] = [];

  constructor(private ressourceService: RessourceService) {}

  ngOnInit() {
    this.getAllRessources();
  }

  getAllRessources() {
    this.ressourceService.getAllRessources().subscribe(
      (data) => {
        this.ressources = data;
      },
      (error) => {
        console.error('Error fetching ressources:', error);
      }
    );
  }

  viewRessource(ressource: Ressource) {
    // Implement view functionality
    console.log('Viewing ressource:', ressource);
  }

  deleteRessource(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette ressource ?')) {
      this.ressourceService.deleteRessource(id).subscribe(
        () => {
          console.log('Ressource supprimée avec succès');
          this.getAllRessources(); // Refresh the list
        },
        (error) => {
          console.error('Erreur lors de la suppression de la ressource:', error);
        }
      );
    }
  }
}
