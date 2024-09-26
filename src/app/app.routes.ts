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
  {path: 'detail-service', component:DetailServiceComponent}


];
