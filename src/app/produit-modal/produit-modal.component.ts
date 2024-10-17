import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Produit } from '../models/produitModel';
import { CartService } from '../services/cart-item.service';
import { CartItem } from '../models/CartItemModel';
import { supprimerZeroPipe } from '../pipe/supprimerZero';

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
    private cartService: CartService
  ) {}

  addToCartAndClose() {
    const cartItem: Omit<CartItem, 'quantite'> = {
      id: this.product.id,
      type: 'produit',
      nom: this.product.nom_produit,
      prix: this.product.prix
    };
    this.cartService.addToCart(cartItem, 1).subscribe(
      () => {
        console.log('Product added to cart:', this.product.nom_produit);
        this.activeModal.close('Product added to cart');
      },
      error => {
        console.error('Error adding product to cart:', error);
      }
    );
  }
}
