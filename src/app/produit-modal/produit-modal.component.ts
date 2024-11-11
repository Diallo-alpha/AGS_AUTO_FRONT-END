import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Produit } from '../models/produitModel';
import { CartService } from '../services/cart-item.service';
import { CartItem } from '../models/CartItemModel';
import { supprimerZeroPipe } from '../pipe/supprimerZero';
import Swal from 'sweetalert2';
import { AuthService } from '../services/authservice.service';

@Component({
  selector: 'app-produit-modal',
  standalone: true,
  imports: [supprimerZeroPipe],
  templateUrl: './produit-modal.component.html',
  styleUrl: './produit-modal.component.css'
})
export class ProduitModalComponent {
  @Input() product!: Produit;

  constructor(
    public activeModal: NgbActiveModal,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  addToCartAndClose() {
    if (!this.authService.isAuthenticated()) {
      Swal.fire({
        title: 'Authentification requise',
        text: 'Vous devez vous connecter pour ajouter des articles au panier.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      this.activeModal.close('Authentication required');
      return;
    }

    const cartItem: Omit<CartItem, 'quantite'> = {
      id: this.product.id,
      type: 'produit',
      nom: this.product.nom_produit,
      prix: this.product.prix
    };

    this.cartService.addToCart(cartItem, 1).subscribe(
      () => {
        Swal.fire({
          title: 'Ajouté au panier',
          text: `${this.product.nom_produit} a été ajouté à votre panier.`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.activeModal.close('Product added to cart');
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
}
