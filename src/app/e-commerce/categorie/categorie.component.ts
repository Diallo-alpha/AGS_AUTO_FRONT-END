import { CategorieService } from './../../services/categorie.service';
import { Component, OnInit } from '@angular/core';
import { SidbarComponent } from '../../dashboard/sidbar/sidbar.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Categorie } from '../../models/categorieModel';

@Component({
  selector: 'app-categorie',
  standalone: true,
  imports: [SidbarComponent, CommonModule, RouterModule],
  templateUrl: './categorie.component.html',
  styleUrl: './categorie.component.css'
})
export class CategorieComponent implements OnInit {

  categories: Categorie[] = [];
  constructor(private categorieService: CategorieService, private router: Router) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categorieService.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des catégories', error);
      }
    );
  }

  deleteCategorie(id: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      this.categorieService.deleteCategorie(id).subscribe(
        () => {
          this.categories = this.categories.filter(cat => cat.id !== id);
          console.log('Catégorie supprimée avec succès');
          this.router.navigate(['/boutique/categorie']);
        },
        (error) => {
          console.error('Erreur lors de la suppression de la catégorie', error);
        }
      );
    }
  }
}
