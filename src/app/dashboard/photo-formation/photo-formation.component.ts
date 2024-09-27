import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidbarComponent } from './../sidbar/sidbar.component';
import { PhotoFormationService } from '../../services/photo-formation.service';
import { PhotoFormation } from '../../models/PhotoFormation';
@Component({
  selector: 'app-photo-formation',
  standalone: true,
  imports: [SidbarComponent, RouterModule, CommonModule],
  templateUrl: './photo-formation.component.html',
  styleUrl: './photo-formation.component.css'
})
export class PhotoFormationComponent implements OnInit {
  photos: PhotoFormation[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  constructor(private photoFormationService: PhotoFormationService) {}

  ngOnInit() {
    this.loadPhotos();
  }

  loadPhotos() {
    this.photoFormationService.getAllPhotoFormations().subscribe(
      (data) => {
        this.photos = data;
        this.totalItems = data.length;
      },
      (error) => {
        console.error('Erreur lors du chargement des photos:', error);
      }
    );
  }

  get paginatedPhotos() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.photos.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  deletePhoto(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) {
      this.photoFormationService.deletePhotoFormation(id).subscribe(
        () => {
          this.photos = this.photos.filter(photo => photo.id !== id);
          this.totalItems--;
        },
        (error) => {
          console.error('Erreur lors de la suppression de la photo:', error);
        }
      );
    }
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
}
