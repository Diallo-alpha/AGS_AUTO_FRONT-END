import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { ArticleService } from '../services/articleservice.service';
import { ServiceService } from '../services/service.service';
import { FormationService } from '../services/formation.service';
import { PartenaireService } from '../services/partenaire.service';
import { Formation } from '../models/FormationModel';
import { Article } from '../models/ArticleModel';
import { service } from '../models/serviceModel';
import { partenaire } from '../models/partenaireModel';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/authservice.service';
import { NavConnectComponent } from '../nav-connect/nav-connect.component';
import { ReduirePipe } from '../pipe/reduire';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [RouterModule, NavbarComponent, FooterComponent, CommonModule, NavConnectComponent, ReduirePipe],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {
  formations: Formation[] = [];
  services: service[] = [];
  articles: Article[] = [];
  partenaires: partenaire[] = [];

  constructor(
    private formationService: FormationService,
    private serviceService: ServiceService,
    private articleService: ArticleService,
    private partenaireService: PartenaireService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadFormations();
    this.loadServices();
    this.loadArticles();
    this.loadPartenaires();
  }

  //les formation
  loadFormations() {
    this.formationService.getAllFormations().subscribe((data: Formation[]) => {
      this.formations = data.slice(0, 4); //4 premiere
    });
  }

  isEtudiant(): boolean {
    return this.authService.isEtudiant();
  }

  //les services
  loadServices() {
    this.serviceService.getServices().subscribe((data: service[]) => {
      this.services = data.slice(0, 4);
    });
  }

  // les articles
  loadArticles() {
    this.articleService.getArticles().subscribe((data: Article[]) => {
      this.articles = data.slice(0, 4);
    });
  }
  //les partenaires
  loadPartenaires() {
    this.partenaireService.getPartenaires().subscribe((data: partenaire[]) => {
      this.partenaires = data.slice(0, 4);
    });
  }
}
