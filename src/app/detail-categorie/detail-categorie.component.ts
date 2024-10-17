import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { NavConnectComponent } from '../nav-connect/nav-connect.component';
import { FooterComponent } from '../footer/footer.component';
import { ProduitService } from '../services/produit.service';
import { Produit } from '../models/produitModel';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProduitModalComponent } from '../produit-modal/produit-modal.component';
import { CartService } from '../services/cart-item.service';
import { CartItem } from '../models/CartItemModel';
import { supprimerZeroPipe } from '../pipe/supprimerZero';
import Swal from 'sweetalert2';
import { AuthService } from '../services/authservice.service';

@Component({
  selector: 'app-detail-categorie',
  standalone: true,
  imports: [NavbarComponent, NavConnectComponent, FooterComponent, CommonModule, supprimerZeroPipe],
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
    private produitService: ProduitService,
    private modalService: NgbModal,
    private cartService: CartService,
    private authService: AuthService,
  ) {
    this.categoryId = 0;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.categoryId = +params['id']; 
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
  addToCart(product: Produit) {
    if (!this.authService.isAuthenticated()) {
      Swal.fire({
        title: 'Authentification requise',
        text: 'Vous devez vous connecter pour ajouter des articles au panier.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    const cartItem: Omit<CartItem, 'quantite'> = {
      id: product.id,
      type: 'produit',
      nom: product.nom_produit,
      prix: product.prix
    };
    this.cartService.addToCart(cartItem, 1).subscribe(
      () => {
        Swal.fire({
          title: 'Ajouté au panier',
          text: `${product.nom_produit} a été ajouté à votre panier.`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
      },
      error => {
        console.error('Error adding product to cart:', error);
        Swal.fire({
          title: 'Erreur',
          text: 'Une erreur est survenue lors de l\'ajout au panier.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }
  openProductModal(product: Produit) {
    const modalRef = this.modalService.open(ProduitModalComponent);
    modalRef.componentInstance.product = product;
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
