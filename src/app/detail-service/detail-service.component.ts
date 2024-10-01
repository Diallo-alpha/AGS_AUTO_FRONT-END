import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ServiceService } from '../services/service.service';
import { service } from '../models/serviceModel';
import { PartenaireService } from '../services/partenaire.service';
import { partenaire } from '../models/partenaireModel';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-detail-service',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, RouterModule],
  templateUrl: './detail-service.component.html',
  styleUrls: ['./detail-service.component.css']
})
export class DetailServiceComponent implements OnInit {
  service: service | null = null;
  partenaire: partenaire | null = null;
  logoUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private serviceService: ServiceService,
    private partenaireService: PartenaireService,
    private sanitizer: DomSanitizer
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

  handleImageError(event: any) {
    console.error('Erreur de chargement de l\'image:', event);
    event.target.src = 'assets/images/default-logo.png'; // Assurez-vous d'avoir une image par défaut
  }
}
