import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../models/CartItemModel';
import { CartService } from '../services/cart-item.service';
import { PaymentService, PaymentResponse } from '../services/paytech.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/authservice.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isCartModalOpen = false;
  cartItems: CartItem[] = [];
  totalPrice = 0;
  errorMessage = '';
  isLoading = true;
  isLoggedIn = false;
  private cartSubscription!: Subscription;
  private authSubscription!: Subscription;

  constructor(
    public cartService: CartService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.cartSubscription = this.cartService.getCart().subscribe(
      items => {
        this.cartItems = items;
        console.log('Cart items loaded:', this.cartItems);
        this.updateTotal();
        if (this.cartItems.length === 0) {
          this.addDefaultItems();
        }
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching cart items:', error);
        this.errorMessage = 'Une erreur est survenue lors du chargement du panier. Veuillez réessayer.';
        this.isLoading = false;
      }
    );

    this.authSubscription = this.authService.currentUser.subscribe(
      user => {
        this.isLoggedIn = !!user;
      }
    );
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Handle successful logout
        console.log('Logout successful');
        this.isLoggedIn = false;
        this.router.navigate(['/']); // Redirect to home page
      },
      error: (error) => {
        console.error('Logout error:', error);
        if (error.message === 'Unauthenticated.') {
          // User is already logged out, just update UI and redirect
          console.log('User was already logged out');
          this.isLoggedIn = false;
          this.authService.clearUserData(); // Make sure local storage is cleared
          this.router.navigate(['/']);
        } else {
          this.errorMessage = 'Une erreur est survenue lors de la déconnexion. Veuillez réessayer.';
        }
      }
    });
  }

  addDefaultItems() {
    const defaultItems: CartItem[] = [
      { id: 1, type: 'formation', nom: 'modifier', prix: 100000, quantite: 1 },
      { id: 2, type: 'formation', nom: 'modifier', prix: 200000, quantite: 1 },
    ];

    console.log('Adding default items:', defaultItems);

    defaultItems.forEach(item => {
      this.cartService.addToCart(item, item.quantite).subscribe(
        () => {
          console.log(`Item ${item.nom} added successfully`);
        },
        error => {
          console.error(`Error adding item ${item.nom}:`, error);
          this.errorMessage = `Une erreur est survenue lors de l'ajout de ${item.nom}. Veuillez réessayer.`;
        }
      );
    });
  }

  openCartModal() {
    this.isCartModalOpen = true;
    console.log('Cart modal opened, items:', this.cartItems);
  }

  closeCartModal() {
    this.isCartModalOpen = false;
  }

  updateTotal() {
    this.totalPrice = this.cartService.getTotalPrice();
  }

  removeProduct(product: CartItem) {
    this.cartService.removeFromCart(product).subscribe(
      () => {
        this.updateTotal();
      },
      error => {
        console.error('Erreur lors de la suppression du produit', error);
        this.errorMessage = 'Erreur lors de la suppression du produit. Veuillez réessayer.';
      }
    );
  }

  updateQuantity(product: CartItem) {
    this.cartService.updateQuantity(product, product.quantite).subscribe(
      () => {
        this.updateTotal();
      },
      error => {
        console.error('Erreur lors de la mise à jour de la quantité', error);
        this.errorMessage = 'Erreur lors de la mise à jour de la quantité. Veuillez réessayer.';
      }
    );
  }
  initiatePayment() {
    this.errorMessage = '';
    this.paymentService.initiatePaymentForCart(this.cartItems, this.totalPrice).subscribe({
      next: (response: PaymentResponse) => {
        console.log('Payment initiation response:', response);
        if (response.success && response.redirect_url) {
          console.log('Redirecting to:', response.redirect_url);
          window.location.href = response.redirect_url;
        } else {
          this.errorMessage = 'Une erreur est survenue lors de l\'initiation du paiement. Veuillez réessayer.';
          console.error('Réponse de paiement invalide', response);
        }
      },
      error: (error: Error) => {
        this.errorMessage = 'Une erreur est survenue lors de la requête de paiement. Veuillez réessayer plus tard.';
        console.error('Erreur lors de la requête de paiement', error);
      }
    });
  }
}
