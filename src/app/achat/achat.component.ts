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
import { RouterModule } from '@angular/router';
import { ReduirePipe } from '../pipe/reduire';
import { CartService } from '../services/cart-item.service';
import { CartItem } from '../models/CartItemModel';

interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

@Component({
  selector: 'app-achat',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, NavConnectComponent, CommonModule, RouterModule, ReduirePipe],
  templateUrl: './achat.component.html',
  styleUrl: './achat.component.css'
})
export class AchatComponent implements OnInit {
  categories: Categorie[] = [];
  category1Products: Produit[] = [];
  category2Products: Produit[] = [];
  category3Products: Produit[] = [];

  constructor(
    private authService: AuthService,
    private produitService: ProduitService,
    private categorieService: CategorieService,
    private cartService: CartService
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
      (response: PaginatedResponse<Produit>) => {
        const productsToDisplay = response.data.slice(0, 4);
        switch (categoryIndex) {
          case 1:
            this.category1Products = productsToDisplay;
            break;
          case 2:
            this.category2Products = productsToDisplay;
            break;
          case 3:
            this.category3Products = productsToDisplay;
            break;
        }
      },
      (error) => {
        console.error(`Error loading products for category ${categoryId}:`, error);
      }
    );
  }

  addToCart(product: Produit) {
    const cartItem: Omit<CartItem, 'quantite'> = {
      id: product.id,
      type: 'produit',
      nom: product.nom_produit,
      prix: product.prix
    };
    this.cartService.addToCart(cartItem, 1).subscribe(
      () => {
        console.log('Product added to cart:', product.nom_produit);
      },
      error => {
        console.error('Error adding product to cart:', error);
      }
    );
  }

  isEtudiant(): boolean {
    return this.authService.isEtudiant();
  }
}
