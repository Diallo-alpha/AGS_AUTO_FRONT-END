import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../models/CartItemModel';
import { CartService } from '../services/cart-item.service';
import { PaymentService, PaymentResponse } from '../services/paytech.service';
import { AuthService } from '../services/authservice.service';
import { UserModel } from '../models/userModel';
import { Subscription } from 'rxjs';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { EtudiantService } from '../services/etudiant.service';

@Component({
  selector: 'app-nav-connect',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule, NgbDropdownModule ],
  templateUrl: './nav-connect.component.html',
  styleUrls: ['./nav-connect.component.css']
})
export class NavConnectComponent implements OnInit, OnDestroy {
  isCartModalOpen = false;
  cartItems: CartItem[] = [];
  totalPrice = 0;
  errorMessage = '';
  isLoading = true;
  currentUser: UserModel | null = null;
  formationsAchetees: any[] = [];
  isCoursDropdownOpen = false;
  private cartSubscription!: Subscription;
  private userSubscription!: Subscription;

  constructor(
    public cartService: CartService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private etudiantService: EtudiantService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.loadFormationsAchetees();
    });

    this.cartSubscription = this.cartService.getCart().subscribe(
      items => {
        this.cartItems = items;
        this.updateTotal();
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching cart items:', error);
        this.errorMessage = 'Une erreur est survenue lors du chargement du panier. Veuillez réessayer.';
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  openCartModal() {
    this.isCartModalOpen = true;
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
        if (response.success && response.redirect_url) {
          window.location.href = response.redirect_url;
        } else {
          this.errorMessage = 'Une erreur est survenue lors de l\'initiation du paiement. Veuillez réessayer.';
        }
      },
      error: (error: Error) => {
        this.errorMessage = 'Une erreur est survenue lors de la requête de paiement. Veuillez réessayer plus tard.';
        console.error('Erreur lors de la requête de paiement', error);
      }
    });
  }

  logout() {
    this.authService.logout().subscribe(
      () => {
        this.router.navigate(['']);
      },
      error => {
        console.error('Erreur lors de la déconnexion', error);
        this.errorMessage = 'Une erreur est survenue lors de la déconnexion. Veuillez réessayer.';
      }
    );
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  navigateToMesCours() {
    this.router.navigate(['/mes-cours']);
  }

  isEtudiant(): boolean {
    return this.authService.isEtudiant();
  }

  //afficher les formation acheter
  loadFormationsAchetees() {
    if (this.isEtudiant()) {
      this.etudiantService.getFormationsAchetees().subscribe(
        formations => {
          this.formationsAchetees = formations;
        },
        error => {
          console.error('Erreur lors du chargement des formations achetées:', error);
          // Gérer l'erreur si nécessaire
        }
      );
    }
  }

  toggleCoursDropdown() {
    this.isCoursDropdownOpen = !this.isCoursDropdownOpen;
  }
  navigateToCours(coursId: number) {
    // Naviguer vers le cours spécifique
    this.router.navigate(['/cours', coursId]);
  }
}
