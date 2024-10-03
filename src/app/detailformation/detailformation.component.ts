import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Formation } from '../models/FormationModel';
import { Video } from '../models/VideoModel';
import { FormationService } from '../services/formation.service';
import { VideoService } from '../services/video-service.service';
import { PaymentService, PaymentResponse } from '../services/paytech.service';
import { NavbarComponent } from './../navbar/navbar.component';
import { FooterComponent } from './../footer/footer.component';
import { AuthService } from '../services/authservice.service';
// import { AuthService } from '../services/auth.service'; // Importation du service AuthService

@Component({
  selector: 'app-detailformation',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './detailformation.component.html',
  styleUrl: './detailformation.component.css'
})
export class DetailformationComponent implements OnInit {
  formation: Formation | null = null;
  videos: Video[] = [];
  errorMessage = '';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationService,
    private videoService: VideoService,
    private paymentService: PaymentService,
    private authService: AuthService  // Injection d'AuthService
  ) {}

  ngOnInit(): void {
    const formationId = Number(this.route.snapshot.paramMap.get('id'));
    if (formationId) {
      this.loadFormationDetails(formationId);
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
    if (!this.formation) {
      this.errorMessage = 'Aucune formation sélectionnée pour le paiement.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const total = this.formation.prix;

    this.paymentService.initiatePaymentForFormation(this.formation.id, total).subscribe({
      next: (response: PaymentResponse) => {
        console.log('Payment initiation response:', response);
        this.isLoading = false;

        if (response.success && response.redirect_url) {
          // Redirection vers l'URL de paiement
          window.location.href = response.redirect_url;
        } else {
          this.errorMessage = 'Erreur lors de l\'initiation du paiement. Veuillez réessayer.';
        }

        // Appel à handleNotification après l'initiation du paiement
        const notificationData = { formationId: this.formation?.id, status: response.success };
        this.paymentService.handleNotification(notificationData).subscribe({
          next: (notificationResponse) => {
            console.log('Notification handled successfully:', notificationResponse);
          },
          error: (error) => {
            console.error('Error handling notification:', error);
          }
        });
      },
      error: (error: Error) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de la requête de paiement. Veuillez réessayer plus tard.';
        console.error('Erreur lors de la requête de paiement', error);
      }
    });
  }

  handlePaymentCancel(): void {
    const userId = this.getCurrentUserId();
    if (userId) {
      this.paymentService.paymentCancel(userId).subscribe({
        next: (response) => {
          console.log('Payment cancelled:', response);
          // Gérer la réponse d'annulation ici
        },
        error: (error) => {
          console.error('Error cancelling payment:', error);
          this.errorMessage = 'Erreur lors de l\'annulation du paiement.';
        }
      });
    }
  }


  handlePaymentSuccess(): void {
    this.paymentService.paymentSuccess().subscribe({
      next: (response) => {
        console.log('Payment successful:', response);
        // Gérer la réponse de succès ici
      },
      error: (error) => {
        console.error('Error handling successful payment:', error);
        this.errorMessage = 'Erreur lors du traitement du paiement réussi.';
      }
    });
  }

  getCurrentUserId(): number | null {
    const currentUser = this.authService.currentUserValue;
    return currentUser && currentUser.id !== undefined ? currentUser.id : null;
  }

}
