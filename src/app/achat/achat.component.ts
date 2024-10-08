import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../services/authservice.service';
import { NavConnectComponent } from '../nav-connect/nav-connect.component';
import { CommonModule } from '@angular/common';
import { ProduitService } from '../services/produit.service';
import { CategorieService } from '../services/categorie.service';
import { Produit } from '../models/produitModel';
import { Categorie } from '../models/categorieModel';
import { apiUrl } from '../services/apiUrl';

@Component({
  selector: 'app-achat',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, NavConnectComponent, CommonModule],
  templateUrl: './achat.component.html',
  styleUrl: './achat.component.css'
})
export class AchatComponent implements OnInit {
  categories: Categorie[] = [];
  category1Products: Produit[] = [];
  category2Products: Produit[] = [];
  category3Products: Produit[] = [];
  baseUrl: string = apiUrl;

  constructor(
    private authService: AuthService,
    private produitService: ProduitService,
    private categorieService: CategorieService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categorieService.getCategories().subscribe(
      (categories) => {
        this.categories = categories.slice(0, 3); 
        this.categories.forEach((category, index) => {
          this.loadProductsByCategory(category.id, index + 1);
        });
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  loadProductsByCategory(categoryId: number, categoryIndex: number) {
    this.produitService.getProductsByCategory(categoryId).subscribe(
      (response) => {
        const produit = response.data.slice(0, 4).map(produit => ({
          ...produit,
          image: produit.image ? this.getFullImageUrl(produit.image) : 'default-image-url'
           }));
        switch (categoryIndex) {
          case 1:
            this.category1Products = produit;
            break;
          case 2:
            this.category2Products = produit;
            break;
          case 3:
            this.category3Products = produit;
            break;
        }
      },
      (error) => {
        console.error(`Error loading products for category ${categoryId}:`, error);
      }
    );
  }

  getFullImageUrl(imagePath: string): string {
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `${this.baseUrl}/storage/${imagePath}`;
  }

  isEtudiant(): boolean {
    return this.authService.isEtudiant();
  }
}
