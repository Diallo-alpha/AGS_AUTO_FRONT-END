import { Component } from '@angular/core';
import { SidbarComponent } from '../../dashboard/sidbar/sidbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommandesService } from '../../services/commandes.service';
import { CommandeModel } from '../../models/commandeModel';

@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [SidbarComponent, RouterModule, CommonModule],
  templateUrl: './commande.component.html',
  styleUrl: './commande.component.css'
})
export class CommandeComponent {
  commandes: CommandeModel[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;

  constructor(private commandeService: CommandesService) {}

  ngOnInit() {
    this.loadCommandes();
  }
  // Charger les commandes
  loadCommandes() {
    this.commandeService.getAllCommandes().subscribe({
      next: (data) => {
        this.commandes = data;
        this.totalPages = Math.ceil(this.commandes.length / this.itemsPerPage);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des commandes', error);
      }
    });
  }
  //
  viewCommande(id: number) {
    // Implémenter la logique pour voir les détails
    console.log('Voir commande:', id);
  }
  //
  editCommande(id: number) {
    // Implémenter la logique pour éditer
    console.log('Éditer commande:', id);
  }
  //statut de la commandes
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'en attente':
        return 'status-pending';
      case 'complétée':
        return 'status-completed';
      case 'annulée':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  //supprimmer une commande
  deleteCommande(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      this.commandeService.deleteCommande(id).subscribe({
        next: () => {
          this.loadCommandes();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression', error);
        }
      });
    }
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
