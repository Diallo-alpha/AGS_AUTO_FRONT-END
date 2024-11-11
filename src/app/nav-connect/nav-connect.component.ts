import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../models/CartItemModel';
import { CartService } from '../services/cart-item.service';
import { PaiementProduitService, PaymentResponse } from '../services/paiement-produit.service';
import { AuthService } from '../services/authservice.service';
import { UserModel } from '../models/userModel';
import { Subscription, Observable, throwError } from 'rxjs';
import { catchError, finalize, tap, switchMap } from 'rxjs/operators';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { EtudiantService } from '../services/etudiant.service';
import { ProfilComponent } from '../profil/profil.component';

@Component({
  selector: 'app-nav-connect',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule, NgbDropdownModule, ProfilComponent],
  templateUrl: './nav-connect.component.html',
  styleUrls: ['./nav-connect.component.css']
})
export class NavConnectComponent implements OnInit, OnDestroy {
  isCartModalOpen = false;
  cartItems: CartItem[] = [];
  totalPrice = 0;
  isLoading = false;
  errorMessage = '';
  currentUser: UserModel | null = null;
  formationsAchetees: any[] = [];
  isCoursDropdownOpen = false;
  private cartSubscription!: Subscription;
  private userSubscription!: Subscription;
  profilePictureUrl: string = 'assets/images/default-profile-pic.jpg';

  constructor(
    public cartService: CartService,
    private paiementProduitService: PaiementProduitService,
    private authService: AuthService,
    private etudiantService: EtudiantService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.currentUser.pipe(
      tap(user => {
        if (user) {
          this.loadUserProfile(user);
        }
      })
    ).subscribe(user => {
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

  private loadUserProfile(user: UserModel) {
    if (user.photo) {
      this.profilePictureUrl = user.photo;
    } else {
      this.profilePictureUrl = 'assets/images/default-profile-pic.jpg';
    }
  }
  login(email: string, password: string) {
    this.authService.login(email, password).pipe(
      switchMap(user => {
        this.loadUserProfile(user);
        return this.etudiantService.getFormationsAchetees();
      }),
      catchError(error => {
        console.error('Erreur de connexion', error);
        this.errorMessage = 'Échec de la connexion. Veuillez réessayer.';
        return throwError(() => new Error(this.errorMessage));
      })
    ).subscribe(
      formations => {
        this.formationsAchetees = formations;
      },
      error => {
        console.error('Erreur lors du chargement des formations', error);
      }
    );
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

  logout() {
    this.authService.logout().subscribe(
      () => {
        this.router.navigate(['/']);
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

  loadFormationsAchetees() {
    if (this.isEtudiant()) {
      this.etudiantService.getFormationsAchetees().subscribe(
        formations => {
          this.formationsAchetees = formations;
        },
        error => {
          console.error('Erreur lors du chargement des formations achetées:', error);
        }
      );
    }
  }

  toggleCoursDropdown() {
    this.isCoursDropdownOpen = !this.isCoursDropdownOpen;
  }

  navigateToCours(coursId: number) {
    this.router.navigate(['/cours', coursId]);
  }

  initiatePayment(): void {
    if (this.cartItems.length === 0) {
      this.errorMessage = 'Votre panier est vide.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.initiatePaymentRequest()
      .pipe(
        catchError((error) => {
          console.error('Erreur lors du processus de paiement', error);
          this.errorMessage = 'Erreur lors du processus de paiement. Veuillez réessayer plus tard.';
          return throwError(() => new Error(this.errorMessage));
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(async (paymentResponse) => {
        console.log('Payment response received:', paymentResponse);
        if (paymentResponse && paymentResponse.success && paymentResponse.redirect_url) {
          console.log('Attempting to open payment window');
          try {
            await this.openPaymentWindow(paymentResponse.redirect_url);
            console.log('Payment window opened, checking status');
            const paymentStatus = await this.checkPaymentStatus();
            console.log('Payment status:', paymentStatus);
            if (paymentStatus === 'payé') {
              await this.finalizePayment();
            }
          } catch (error) {
            console.error('Error in payment process:', error);
            this.errorMessage = 'Une erreur est survenue lors du processus de paiement.';
          }
        } else {
          console.error('Invalid payment response:', paymentResponse);
          this.errorMessage = 'Réponse de paiement invalide.';
        }
      });
  }

  private initiatePaymentRequest(): Observable<PaymentResponse> {
    return this.paiementProduitService.initierPaiement(this.cartItems);
  }

  private openPaymentWindow(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const popup = window.open(url, '_blank');
      if (!popup) {
        reject(new Error("Impossible d'ouvrir la fenêtre de paiement."));
        return;
      }

      const checkInterval = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 1000);

      setTimeout(() => {
        if (!popup.closed) {
          clearInterval(checkInterval);
          popup.close();
          reject(new Error('Le paiement a expiré ou a été annulé.'));
        }
      }, 300000); // 5 minutes timeout
    });
  }

  private async checkPaymentStatus(): Promise<string> {
    const maxAttempts = 10;
    const delayBetweenAttempts = 5000; // 5 seconds

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await this.paiementProduitService.gererSuccesPaiement('').toPromise();
        if (response && response.status !== 'en attente') {
          return response.status;
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du paiement', error);
      }

      await new Promise(resolve => setTimeout(resolve, delayBetweenAttempts));
    }

    throw new Error('Timeout lors de la vérification du statut du paiement.');
  }

  private async finalizePayment(): Promise<void> {
    try {
      await this.paiementProduitService.gererSuccesPaiement('').toPromise();
      console.log('Paiement finalisé avec succès');
      this.cartItems = [];
      this.updateTotal();
    } catch (error) {
      console.error('Erreur lors de la finalisation du paiement', error);
      throw new Error('Erreur lors de la finalisation du paiement');
    }
  }
}
