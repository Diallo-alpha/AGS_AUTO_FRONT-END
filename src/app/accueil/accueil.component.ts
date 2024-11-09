import { Component, OnInit } from '@angular/core';
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
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [RouterModule, NavbarComponent, FooterComponent, CommonModule, NavConnectComponent, ReduirePipe],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit {
  formations: Formation[] = [];
  services: service[] = [];
  articles: Article[] = [];
  partenaires: partenaire[] = [];
  formationAvis: { [key: number]: any } = {};

  constructor(
    private formationService: FormationService,
    private serviceService: ServiceService,
    private articleService: ArticleService,
    private partenaireService: PartenaireService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData() {
    forkJoin({
      formations: this.formationService.getAllFormations(),
      services: this.serviceService.getServices(),
      articles: this.articleService.getArticles(),
      partenaires: this.partenaireService.getPartenaires()
    }).subscribe(
      (results) => {
        this.formations = results.formations.slice(0, 4);
        this.services = results.services.slice(0, 4);
        this.articles = results.articles.slice(0, 4);
        this.partenaires = results.partenaires.slice(0, 4);

        // Une fois que les formations sont chargées, chargez les avis
        this.loadFormationAvis();
      },
      (error) => {
        console.error('Erreur lors du chargement des données:', error);
      }
    );
  }

  loadFormationAvis() {
    this.formations.forEach(formation => {
      this.formationService.getFormationAvis(formation.id).subscribe(
        (data) => {
          this.formationAvis[formation.id] = data;
        },
        (error) => {
          console.error(`Erreur lors de la récupération des avis pour la formation ${formation.id}:`, error);
        }
      );
    });
  }

  isEtudiant(): boolean {
    return this.authService.isEtudiant();
  }
}
