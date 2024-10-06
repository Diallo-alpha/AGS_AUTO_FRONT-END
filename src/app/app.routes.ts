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
import { ModifierPhotoComponent } from './dashboard/modifier-photo/modifier-photo.component';
import { ModifierFormationComponent } from './dashboard/modifier-formation/modifier-formation.component';
import { ListVideoComponent } from './dashboard/videos/list-video/list-video.component';
import { AjouterComponent } from './dashboard/videos/ajouter/ajouter.component';
import { ModifierComponent } from './dashboard/videos/modifier/modifier.component';
import { ListArticleComponent } from './dashboard/article/list-article/list-article.component';
import { AjouterArticleComponent } from './dashboard/article/ajouter-article/ajouter-article.component';
import { ModifierArticleComponent } from './dashboard/article/modifier-article/modifier-article.component';
import { ListPartenaireComponent } from './dashboard/partenaire/list-partenaire/list-partenaire.component';
import { AjouterPartenaireComponent } from './dashboard/partenaire/ajouter-partenaire/ajouter-partenaire.component';
import { ModifierPartenaireComponent } from './dashboard/partenaire/modifier-partenaire/modifier-partenaire.component';
import { ListServiceComponent } from './dashboard/service-client/list-service/list-service.component';
import { AjouterServiceComponent } from './dashboard/service-client/ajouter-service/ajouter-service.component';
import { ModifierServiceComponent } from './dashboard/service-client/modifier-service/modifier-service.component';
import { CoursComponent } from './cours/cours.component';
import { RessourceComponent } from './dashboard/ressource/ressource.component';
import { AjouterRessourceComponent } from './dashboard/ressource/ajouter-ressource/ajouter-ressource.component';
import { ModifierRessourceComponent } from './dashboard/ressource/modifier-ressource/modifier-ressource.component';

export const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: ''},
  {path: '', component:AccueilComponent},
  {path: 'inscription', component:InscriptionComponent},
  {path: 'login', component:ConnexionComponent},
  {path: 'formation', component:FormationComponent},
  {path: 'detail-formation/:id', component:DetailformationComponent},
  {path: 'article', component:ArticleComponent},
  {path: 'detail-article/:id', component:DetailArticleComponent},
  {path: 'contact', component:ContactComponent},
  {path: 'detail-service/:id', component:DetailServiceComponent},
  {path: 'boutique', component:AchatComponent},
  {path: 'dashboard/statique', component:StatiqueComponent},
  //route pour les formations
  {path: 'dashboard/formation/modifier/:id', component:ModifierFormationComponent},
  {path: 'dashboard/formation', component:ListFormationComponent},
  {path: 'dashboard/ajouter/formation', component:AjoutFormationComponent},
  //Routes pour les photos de formation
  {path: 'dashboard/photos/formation', component:PhotoFormationComponent},
  {path: 'dashboard/ajouter/photo', component:AjoutPhotoComponent},
  {path: 'dashboard/modifier/photo/:id', component: ModifierPhotoComponent },
  //video
  {path: 'dashboard/video', component:ListVideoComponent},
  {path: 'ajouter/video', component:AjouterComponent},
  {path: 'modifier/video/:id', component:ModifierComponent},
  //article dashboard
  {path: 'dashboard/article', component:ListArticleComponent},
  {path: 'dashboard/article/ajouter', component:AjouterArticleComponent},
  { path: 'dashboard/article/modifier/:id', component: ModifierArticleComponent },
  //courrs
  {path: 'cours/:id', component:CoursComponent},
  //partenaire
  {path: 'dashboard/partenaire', component:ListPartenaireComponent},
  {path: 'dashboard/partenaire/ajouter', component:AjouterPartenaireComponent},
  {path: 'dashboard/partenaire/modifier/:id', component:ModifierPartenaireComponent},
  //service
  {path: 'dashboard/service', component:ListServiceComponent},
  {path: 'dashboard/service/ajouter', component:AjouterServiceComponent},
  {path: 'dashboard/service/modifier/:id', component:ModifierServiceComponent},
  //ressource
  {path: 'dashboard/ressource', component:RessourceComponent},
  {path: 'dashboard/ressource/ajouter', component:AjouterRessourceComponent},
  {path: 'dashboard/ressource/modifier/:id', component:ModifierRessourceComponent},
];
