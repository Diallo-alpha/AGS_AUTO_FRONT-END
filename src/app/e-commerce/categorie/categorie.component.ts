import { CategorieService } from './../../services/categorie.service';
import { Component, OnInit } from '@angular/core';
import { SidbarComponent } from '../../dashboard/sidbar/sidbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Categorie } from '../../models/categorieModel';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorie',
  standalone: true,
  imports: [SidbarComponent, CommonModule, RouterModule],
  templateUrl: './categorie.component.html',
  styleUrl: './categorie.component.css'
})
export class CategorieComponent implements OnInit {
  categories: Categorie[] = [];

  constructor(private categorieService: CategorieService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categorieService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors du chargement des catégories',
          confirmButtonColor: '#c65102'
        });
        console.error('Erreur lors du chargement des catégories:', error);
      }
    });
  }

  deleteCategorie(id: number) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c65102',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categorieService.deleteCategorie(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Supprimé !',
              text: 'La catégorie a été supprimée.',
              icon: 'success',
              confirmButtonColor: '#c65102'
            });
            this.loadCategories();
          },
          error: (error) => {
            Swal.fire({
              title: 'Erreur !',
              text: 'Une erreur est survenue lors de la suppression.',
              icon: 'error',
              confirmButtonColor: '#c65102'
            });
            console.error('Erreur lors de la suppression:', error);
          }
        });
      }
    });
  }
}
