import { DetailformationComponent } from './detailformation/detailformation.component';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { FormationComponent } from './formation/formation.component';
import { NavConnectComponent } from './nav-connect/nav-connect.component';
import { CoursComponent } from './cours/cours.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CoursComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
