import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Formation } from '../models/FormationModel';
import { Video } from '../models/VideoModel';
import { FormationService } from '../services/formation.service';
import { VideoService } from '../services/video-service.service';
import { PaymentService } from '../services/paytech.service';
import { NavbarComponent } from './../navbar/navbar.component';
import { FooterComponent } from './../footer/footer.component';

@Component({
  selector: 'app-detailformation',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, RouterModule],
  templateUrl: './detailformation.component.html',
  styleUrl: './detailformation.component.css'
})
export class DetailformationComponent implements OnInit {
  formation: Formation | null = null;
  videos: Video[] = [];
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationService,
    private videoService: VideoService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    const formationId = Number(this.route.snapshot.paramMap.get('id'));
    if (formationId) {
      this.loadFormationDetails(formationId);
    }
  }

  loadFormationDetails(id: number): void {
    this.formationService.getFormation(id).subscribe(
      (data: Formation) => {
        this.formation = data;
        this.loadFormationVideos(id);
      },
      error => {
        console.error('Error fetching formation details', error);
      }
    );
  }

  loadFormationVideos(id: number): void {
    this.videoService.getVideoRessources(id).subscribe(
      (data: any) => {
        if (Array.isArray(data)) {
          this.videos = data;
        } else if (typeof data === 'object' && data !== null) {
          const videoArray = Object.values(data).find(value => Array.isArray(value));
          this.videos = Array.isArray(videoArray) ? videoArray : [];
        } else {
          this.videos = [];
        }
      },
      error => {
        console.error('Error fetching videos', error);
        this.videos = [];
      }
    );
  }

  initiatePayment(): void {
    if (!this.formation) {
      this.errorMessage = 'Aucune formation sélectionnée pour le paiement.';
      return;
    }

    const totalPrice = this.formation.prix;

    this.paymentService.initiatePaymentForFormation(this.formation.id, totalPrice).subscribe({
      next: (response) => {
        console.log('Payment initiation response:', response);
        if ('success' in response && response.success === 1 && response.redirect_url) {
          window.location.href = response.redirect_url;
        } else if ('redirectUrl' in response) {
          window.location.href = response.redirectUrl ?? '';
        } else {
          this.errorMessage = 'Erreur lors de l\'initiation du paiement. Veuillez réessayer.';
        }
      },
      error: (error: Error) => {
        this.errorMessage = 'Erreur lors de la requête de paiement. Veuillez réessayer plus tard.';
        console.error('Erreur lors de la requête de paiement', error);
      }
    });
  }
}
