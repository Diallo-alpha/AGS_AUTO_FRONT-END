import { Component } from '@angular/core';
import { SidbarComponent } from '../../dashboard/sidbar/sidbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommandesService } from '../../services/commandes.service';
import { CommandeModel } from '../../models/commandeModel';
import { supprimerZeroPipe } from '../../pipe/supprimerZero';
@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [SidbarComponent, RouterModule, CommonModule, FormsModule, supprimerZeroPipe],
  templateUrl: './commande.component.html',
  styleUrl: './commande.component.css'
})
export class CommandeComponent {
  commandes: CommandeModel[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;
  statusOptions: string[] = ['en attente', 'liverer'];

  constructor(private commandeService: CommandesService) {}

  ngOnInit() {
    this.loadCommandes();
  }

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

  updateStatus(commande: CommandeModel, newStatus: string) {
    const updateData = {
      ...commande,
      status: newStatus
    };

    this.commandeService.updateCommande(commande.id, updateData).subscribe({
      next: () => {
        commande.status = newStatus;
        console.log('Statut mis à jour avec succès');
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut', error);
      }
    });
  }

  // Reste du code existant...
  viewCommande(id: number) {
    console.log('Voir commande:', id);
  }

  editCommande(id: number) {
    console.log('Éditer commande:', id);
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'en attente':
        return 'status-pending';
      case 'liverer':
        return 'status-completed';
      default:
        return '';
    }
  }

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
