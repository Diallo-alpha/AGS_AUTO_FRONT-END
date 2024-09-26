import { Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { FormationComponent } from './formation/formation.component';
import { ArticleComponent } from './article/article.component';
import { ContactComponent } from './contact/contact.component';
import { DetailformationComponent } from './detailformation/detailformation.component';
import { DetailServiceComponent } from './detail-service/detail-service.component';
import { DetailArticleComponent } from './detail-article/detail-article.component';
import { AchatComponent } from './achat/achat.component';
import { StatiqueComponent } from './dashboard/statique/statique.component';
import { ListFormationComponent } from './dashboard/list-formation/list-formation.component';
import { AjoutFormationComponent } from './dashboard/ajout-formation/ajout-formation.component';
import { PhotoFormationComponent } from './dashboard/photo-formation/photo-formation.component';
import { AjoutPhotoComponent } from './dashboard/ajout-photo/ajout-photo.component';

export const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: ''},
  {path: '', component:AccueilComponent},
  {path: 'inscription', component:InscriptionComponent},
  {path: 'login', component:ConnexionComponent},
  {path: 'formation', component:FormationComponent},
  {path: 'detail-formation', component:DetailformationComponent},
  {path: 'article', component:ArticleComponent},
  {path: 'detail-article', component:DetailArticleComponent},
  {path: 'contact', component:ContactComponent},
  {path: 'detail-service', component:DetailServiceComponent},
  {path: 'boutique', component:AchatComponent},
  {path: 'dashboard/statique', component:StatiqueComponent},
  {path: 'dashboard/formation', component:ListFormationComponent},
  {path: 'dashboard/ajouter/formation', component:AjoutFormationComponent},
  //Routes pour les photos de formation
  {path: 'dashboard/photos/formation', component:PhotoFormationComponent},
  {path: 'dashboard/ajouter/photo', component:AjoutPhotoComponent}

];
