import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { NavConnectComponent } from '../nav-connect/nav-connect.component';
import { FooterComponent } from '../footer/footer.component';
import { ProduitService } from '../services/produit.service';
import { Produit } from '../models/produitModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-categorie',
  standalone: true,
  imports: [NavbarComponent, NavConnectComponent, FooterComponent, CommonModule],
  templateUrl: './detail-categorie.component.html',
  styleUrl: './detail-categorie.component.css'
})
export class DetailCategorieComponent implements OnInit {
  categoryId: number;
  products: Produit[] = [];
  currentPage = 1;
  totalPages = 1;

  constructor(
    private route: ActivatedRoute,
    private produitService: ProduitService
  ) {
    this.categoryId = 0;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.categoryId = +params['id']; // Le '+' convertit la chaîne en nombre
      this.loadProducts();
    });
  }

  loadProducts() {
    this.produitService.getProductsByCategory(this.categoryId, this.currentPage).subscribe({
      next: (response) => {
        this.products = response.data;
        this.currentPage = response.current_page;
        this.totalPages = response.last_page;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des produits:', error);
      }
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }
  }
}
