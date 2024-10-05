import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Formation } from '../models/FormationModel';
import { Video } from '../models/VideoModel';
import { FormationService } from '../services/formation.service';
import { VideoService } from '../services/video-service.service';
import { PaymentService, PaymentResponse, PaymentVerificationResponse } from '../services/paytech.service';
import { NavbarComponent } from './../navbar/navbar.component';
import { FooterComponent } from './../footer/footer.component';
import { AuthService } from '../services/authservice.service';
import { NavConnectComponent } from '../nav-connect/nav-connect.component';
import { switchMap, mergeMap, takeWhile, catchError } from 'rxjs/operators';
import { Observable, of, timer, throwError, map } from 'rxjs';


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

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationService,
    private videoService: VideoService,
    private paymentService: PaymentService,
    private authService: AuthService
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

    this.paymentService.initiatePaymentForFormation(this.formation.id, this.formation.prix)
      .pipe(
        switchMap((response: PaymentResponse) => {
          if (response.success && response.redirect_url) {
            window.open(response.redirect_url, '_blank');
            return this.waitForPaymentCompletion(this.formation!.id);
          } else {
            return throwError(() => new Error('Erreur lors de l\'initiation du paiement.'));
          }
        }),
        catchError(error => {
          this.isLoading = false;
          this.errorMessage = 'Erreur lors du processus de paiement. Veuillez réessayer plus tard.';
          console.error('Erreur lors du processus de paiement', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (result) => {
          this.isLoading = false;
          if (result) {
            console.log('Paiement réussi et traité');
            // Gérer le paiement réussi (par exemple, afficher un message de succès, mettre à jour l'interface utilisateur)
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Une erreur est survenue lors du traitement du paiement.';
          console.error('Erreur finale lors du traitement du paiement', error);
        }
      });
  }

  waitForPaymentCompletion(formationId: number): Observable<any> {
    // Attendre 30 secondes avant de commencer à vérifier
    const initialDelay = 30000;
    const checkInterval = 10000; // Vérifier toutes les 10 secondes ensuite

    return timer(initialDelay, checkInterval).pipe(
      mergeMap(() => this.checkPaymentStatus(formationId)),
      takeWhile((status) => status === 'en attente', true),
      switchMap((finalStatus) => {
        if (finalStatus === 'payé') {
          return this.paymentService.handlePaymentSuccess(formationId);
        } else if (finalStatus !== 'en attente') {
          return throwError(() => new Error('Le paiement a échoué ou a expiré.'));
        }
        return of(null);
      }),
      takeWhile((result) => result === null, true)
    );
  }

  checkPaymentStatus(formationId: number): Observable<string> {
    return this.paymentService.verifyPayment(formationId.toString()).pipe(
      map((response: PaymentVerificationResponse) => response.status),
      catchError(error => {
        console.error('Erreur lors de la vérification du paiement', error);
        return of('erreur');
      })
    );
  }

  // checkPaymentStatus(formationId: number): Observable<any> {
  //   return timer(0, 5000).pipe(
  //     mergeMap(() => this.paymentService.verifyPayment(formationId.toString())),
  //     takeWhile((response: PaymentVerificationResponse) => response.status === 'en attente', true),
  //     mergeMap((response: PaymentVerificationResponse) => {
  //       if (response.status === 'payé') {
  //         return this.paymentService.handlePaymentSuccess(formationId);
  //       }
  //       return of(null);
  //     }),
  //     catchError(error => {
  //       console.error('Erreur lors de la vérification du paiement', error);
  //       return of(null);
  //     })
  //   );
  // }


  getCurrentUserId(): number | null {
    const currentUser = this.authService.currentUserValue;
    return currentUser && currentUser.id !== undefined ? currentUser.id : null;
  }

  isEtudiant(): boolean {
    return this.authService.isEtudiant();
  }
}
