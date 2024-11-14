import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Formation } from '../models/FormationModel';
import { FormationService } from '../services/formation.service';
import { VideoService } from '../services/video-service.service';
import { Video } from '../models/VideoModel';
import { PaymentService, PaymentResponse } from '../services/paytech.service';
import { AuthService } from '../services/authservice.service';
import { catchError, finalize } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { NavConnectComponent } from '../nav-connect/nav-connect.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-detailformation',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, NavConnectComponent],
  templateUrl: './detailformation.component.html',
  styleUrl: './detailformation.component.css'
})
export class DetailformationComponent implements OnInit {
  formation: Formation | null = null;
  videos: Video[] = [];
  errorMessage = '';
  isLoading = false;
  transactionId: string = '';
  avis: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formationService: FormationService,
    private videoService: VideoService,
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const formationId = Number(this.route.snapshot.paramMap.get('id'));
    if (formationId) {
      this.loadFormationDetails(formationId);
      this.loadFormationAvis(formationId);
    }
  }

  loadFormationDetails(id: number): void {
    this.isLoading = true;
    this.formationService.getFormation(id).subscribe({
      next: (data: Formation) => {
        this.formation = data;
        this.loadFormationVideos(id);
      },
      error: (error) => {
        console.error('Error fetching formation details', error);
        this.errorMessage = 'Erreur lors du chargement des détails de la formation.';
        this.isLoading = false;
      }
    });
  }

  loadFormationVideos(id: number): void {
    this.videoService.getVideoRessources(id).subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.videos = data;
        } else if (typeof data === 'object' && data !== null) {
          const videoArray = Object.values(data).find(value => Array.isArray(value));
          this.videos = Array.isArray(videoArray) ? videoArray : [];
        } else {
          this.videos = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching videos', error);
        this.videos = [];
        this.errorMessage = 'Erreur lors du chargement des vidéos.';
        this.isLoading = false;
      }
    });
  }

  initiatePayment(): void {
    if (!this.authService.isAuthenticated()) {
      Swal.fire({
        title: 'Authentification requise',
        text: 'Vous devez vous connecter pour acheter cette formation',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#9C4902',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Se connecter',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          const returnUrl = this.router.url;
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: returnUrl }
          });
        }
      });
      return;
    }

    if (!this.formation) {
      this.errorMessage = 'Aucune formation sélectionnée pour le paiement.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.initiatePaymentRequest(this.formation.id, this.formation.prix)
      .pipe(
        catchError((error) => {
          console.error('Erreur lors du processus de paiement', error);
          Swal.fire({
            title: 'Erreur',
            text: 'Une erreur est survenue lors du processus de paiement. Veuillez réessayer plus tard.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          return throwError(() => new Error(this.errorMessage));
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: async (paymentResponse) => {
          console.log('Payment response received:', paymentResponse);
          if (paymentResponse && paymentResponse.success && paymentResponse.redirect_url) {
            console.log('Attempting to open payment window');
            try {
              this.transactionId = paymentResponse.transaction_id;
              await this.openPaymentWindow(paymentResponse.redirect_url);
              console.log('Payment window opened, checking status');
              const paymentStatus = await this.checkPaymentStatus(this.formation!.id);
              console.log('Payment status:', paymentStatus);
              if (paymentStatus === 'payé') {
                await this.finalizePayment(this.formation!.id, this.transactionId);
                Swal.fire({
                  title: 'Succès',
                  text: 'Paiement effectué avec succès !',
                  icon: 'success',
                  confirmButtonText: 'OK'
                });
              }
            } catch (error) {
              console.error('Error in payment process:', error);
              Swal.fire({
                title: 'Erreur',
                text: 'Une erreur est survenue lors du processus de paiement.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          } else {
            console.error('Invalid payment response:', paymentResponse);
            Swal.fire({
              title: 'Erreur',
              text: 'Réponse de paiement invalide.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
      });
  }

  private initiatePaymentRequest(formationId: number, price: number): Observable<PaymentResponse> {
    return this.paymentService.initiatePaymentForFormation(formationId, price);
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

  private async checkPaymentStatus(formationId: number): Promise<string> {
    const maxAttempts = 10;
    const delayBetweenAttempts = 5000; // 5 seconds

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await this.paymentService.verifyPayment(formationId.toString()).toPromise();
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

  private async finalizePayment(formationId: number, refPayment: string): Promise<void> {
    try {
      await this.paymentService.handlePaymentSuccess(formationId, refPayment).toPromise();
      console.log('Paiement finalisé avec succès');
    } catch (error) {
      console.error('Erreur lors de la finalisation du paiement', error);
      throw new Error('Erreur lors de la finalisation du paiement');
    }
  }

  getCurrentUserId(): number | null {
    const currentUser = this.authService.currentUserValue;
    return currentUser && currentUser.id !== undefined ? currentUser.id : null;
  }

  isEtudiant(): boolean {
    return this.authService.isEtudiant();
  }
  //
  loadFormationAvis(id: number): void {
    this.formationService.getFormationAvis(id).subscribe({
      next: (data: any) => {
        this.avis = data.avis;
      },
      error: (error) => {
        console.error('Error fetching avis', error);
        this.errorMessage = 'Erreur lors du chargement des avis.';
      }
    });
  }
}
