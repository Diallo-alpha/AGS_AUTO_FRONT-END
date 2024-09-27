import { Component, OnInit } from '@angular/core';
import { SidbarComponent } from '../sidbar/sidbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormationService } from '../../services/formation.service';
import { PhotoFormationService } from '../../services/photo-formation.service';
import { Formation } from '../../models/FormationModel';
import { PhotoFormation } from '../../models/PhotoFormation';
import { forkJoin, Observable } from 'rxjs';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { mergeMap } from 'rxjs/operators';

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
  apiStorageUrl = 'https://certif.alphaloppecity.simplonfabriques.com/storage';

  constructor(
    private formationService: FormationService,
    private photoFormationService: PhotoFormationService
  ) {}

  ngOnInit() {
    this.loadFormations();
  }

  loadFormations() {
    this.formationService.getAllFormations().subscribe({
      next: (data) => {
        this.formations = data;
        this.loadPhotosForFormations();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des formations', error);
      }
    });
  }

  loadPhotosForFormations() {
    const photoObservables = this.formations.map(formation =>
      this.getFirstPhotoForFormation(formation.id)
    );

    forkJoin(photoObservables).subscribe({
      next: (photoUrls) => {
        this.formations.forEach((formation, index) => {
          formation.imageUrl = photoUrls[index] || 'https://placehold.co/400x300';
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement des photos', error);
      }
    });
  }

  getFirstPhotoForFormation(formationId: number): Observable<string | null> {
    return this.photoFormationService.getPhotosByFormation(formationId).pipe(
      mergeMap(photos => {
        if (photos && photos.length > 0) {
          // Convertir la promesse en Observable
          return from(this.fetchImageUrl(photos[0].photo));
        }
        return from(Promise.resolve(null)); // Retourner un Observable avec une valeur null
      })
    );
  }
  fetchImageUrl(photoPath: string): Promise<string> {
    return fetch(`${this.apiStorageUrl}/${photoPath}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => URL.createObjectURL(blob))
      .catch(error => {
        console.error('Error fetching image:', error);
        return 'https://placehold.co/400x300'; // Image par défaut en cas d'erreur
      });
  }

  get paginatedFormations() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.formations.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.formations.length / this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  deleteFormation(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      this.formationService.deleteFormation(id).subscribe({
        next: () => {
          this.formations = this.formations.filter(f => f.id !== id);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la formation', error);
        }
      });
    }
  }
}
