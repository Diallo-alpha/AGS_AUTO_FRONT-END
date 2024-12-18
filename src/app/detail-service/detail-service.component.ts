import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ServiceService } from '../services/service.service';
import { service } from '../models/serviceModel';
import { PartenaireService } from '../services/partenaire.service';
import { partenaire } from '../models/partenaireModel';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router} from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NavConnectComponent } from '../nav-connect/nav-connect.component';
import { AuthService } from '../services/authservice.service';
import { ReservationFormComponent } from '../reservation-form/reservation-form.component';

@Component({
  selector: 'app-detail-service',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, RouterModule, NavConnectComponent, ReservationFormComponent],
  templateUrl: './detail-service.component.html',
  styleUrls: ['./detail-service.component.css']
})
export class DetailServiceComponent implements OnInit {
  service: service | null = null;
  partenaire: partenaire | null = null;
  logoUrl: SafeResourceUrl | null = null;
  @ViewChild(ReservationFormComponent)
  reservationForm!: ReservationFormComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService,
    private partenaireService: PartenaireService,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const serviceId = Number(this.route.snapshot.paramMap.get('id'));
    if (serviceId) {
      this.loadServiceDetails(serviceId);
    }
  }

  loadServiceDetails(serviceId: number): void {
    this.serviceService.getService(serviceId).subscribe(
      (data: service) => {
        this.service = data;
        if (this.service.partenaire_id) {
          this.loadPartenaire(this.service.partenaire_id);
        }
      },
      error => {
        console.error('Erreur lors de la récupération des détails du service', error);
      }
    );
  }

  loadPartenaire(partenaireId: number): void {
    this.partenaireService.getPartenaire(partenaireId).subscribe(
      (data: partenaire) => {
        this.partenaire = data;
        if (this.partenaire.logo) {
          this.logoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.partenaire.logo);
        }
        console.log('Logo URL:', this.logoUrl);
      },
      error => {
        console.error('Erreur lors de la récupération des détails du partenaire', error);
      }
    );
  }

  isEtudiant(): boolean {
    return this.authService.isEtudiant();
  }
  //
  showReservationForm() {
    if (this.authService.isAuthenticated()) {
      this.reservationForm.show();
    } else {
      // Stocker l'URL actuelle pour rediriger après la connexion
      const currentUrl = this.router.url;
      this.authService.setRedirectUrl(currentUrl);

      alert('Veuillez vous connecter pour faire une réservation.');
      this.router.navigate(['/login']);
    }
  }

}
