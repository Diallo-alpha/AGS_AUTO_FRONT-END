import { Component, OnInit } from '@angular/core';
import { SidbarComponent } from '../sidbar/sidbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormationService } from '../../services/formation.service';
import { Formation } from '../../models/FormationModel';

@Component({
  selector: 'app-list-formation',
  standalone: true,
  imports: [SidbarComponent, RouterModule, CommonModule],
  templateUrl: './list-formation.component.html',
  styleUrl: './list-formation.component.css'
})
export class ListFormationComponent implements OnInit {
  formations: Formation[] = [];
  currentPage = 1;
  itemsPerPage = 6;

  constructor(private formationService: FormationService) {}

  ngOnInit() {
    this.loadFormations();
  }

  loadFormations() {
    this.formationService.getAllFormations().subscribe({
      next: (formations: Formation[]) => {
        this.formations = formations;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des formations', error);
      }
    });
  }

  get paginatedFormations(): Formation[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.formations.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.formations.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  deleteFormation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      this.formationService.deleteFormation(id).subscribe({
        next: () => {
          this.formations = this.formations.filter(f => f.id !== id);
        },
        error: (error: any) => {
          console.error('Erreur lors de la suppression de la formation', error);
        }
      });
    }
  }
}
