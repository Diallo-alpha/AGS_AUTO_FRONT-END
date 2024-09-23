import { Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { ConnexionComponent } from './connexion/connexion.component';

export const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: ''},
  {path: '', component:AccueilComponent},
  {path: 'inscription', component:InscriptionComponent},
  {path: 'login', component:ConnexionComponent},

];
