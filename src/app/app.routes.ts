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
import { ProduitComponent } from './e-commerce/produit/produit.component';
import { ProduitAjouterComponent } from './e-commerce/produit-ajouter/produit-ajouter.component';
import { ProduitModifierComponent } from './e-commerce/produit-modifier/produit-modifier.component';
import { CategorieComponent } from './e-commerce/categorie/categorie.component';
import { CategorieAjouterComponent } from './e-commerce/categorie-ajouter/categorie-ajouter.component';
import { CategorieModifierComponent } from './e-commerce/categorie-modifier/categorie-modifier.component';
import { CommandeComponent } from './e-commerce/commande/commande.component';
import { PaiementComponent } from './e-commerce/paiement/paiement.component';
import { EtudiantGuard } from './Guardes/etudiant.guard';
import { AdminGuard } from './Guardes/admin.guard';
import { ProfilComponent } from './profil/profil.component';
import { DetailCategorieComponent } from './detail-categorie/detail-categorie.component';
import { ListcoursComponent } from './listcours/listcours.component';
import { ListCoursTermineComponent } from './list-cours-termine/list-cours-termine.component';
import { AProposComponent } from './a-propos/a-propos.component';

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
  {path: 'detail/categorie/:id', component:DetailCategorieComponent},
  //
  {path: 'dashboard/statique', component:StatiqueComponent, canActivate: [AdminGuard]},
  //route pour les formations
  {path: 'dashboard/formation/modifier/:id', component:ModifierFormationComponent, canActivate: [AdminGuard] },
  {path: 'dashboard/formation', component:ListFormationComponent, canActivate: [AdminGuard]},
  {path: 'dashboard/ajouter/formation', component:AjoutFormationComponent, canActivate: [AdminGuard]},
  //Routes pour les photos de formation
  {path: 'dashboard/photos/formation', component:PhotoFormationComponent, canActivate: [AdminGuard]},
  {path: 'dashboard/ajouter/photo', component:AjoutPhotoComponent, canActivate: [AdminGuard]},
  {path: 'dashboard/modifier/photo/:id', component: ModifierPhotoComponent, canActivate: [AdminGuard] },
  //video
  {path: 'dashboard/video', component:ListVideoComponent, canActivate: [AdminGuard]},
  {path: 'ajouter/video', component:AjouterComponent, canActivate: [AdminGuard]},
  {path: 'modifier/video/:id', component:ModifierComponent, canActivate: [AdminGuard]},
  //article dashboard
  {path: 'dashboard/article', component:ListArticleComponent, canActivate: [AdminGuard]},
  {path: 'dashboard/article/ajouter', component:AjouterArticleComponent, canActivate: [AdminGuard]},
  { path: 'dashboard/article/modifier/:id', component: ModifierArticleComponent, canActivate: [AdminGuard] },
  //courrs
  {path: 'cours/:id', component:CoursComponent, canActivate: [EtudiantGuard]},
  //partenaire
  {path: 'dashboard/partenaire', component:ListPartenaireComponent, canActivate: [AdminGuard]},
  {path: 'dashboard/partenaire/ajouter', component:AjouterPartenaireComponent, canActivate: [AdminGuard]},
  {path: 'dashboard/partenaire/modifier/:id', component:ModifierPartenaireComponent, canActivate: [AdminGuard]},
  //service
  {path: 'dashboard/service', component:ListServiceComponent, canActivate: [AdminGuard]},
  {path: 'dashboard/service/ajouter', component:AjouterServiceComponent, canActivate: [AdminGuard]},
  {path: 'dashboard/service/modifier/:id', component:ModifierServiceComponent, canActivate: [AdminGuard]},
  //ressource
  {path: 'dashboard/ressource', component:RessourceComponent, canActivate: [AdminGuard]},
  {path: 'dashboard/ressource/ajouter', component:AjouterRessourceComponent, canActivate: [AdminGuard]},
  {path: 'dashboard/ressource/modifier/:id', component:ModifierRessourceComponent, canActivate: [AdminGuard]},
  //e-commerce produit
  {path: 'e-commerce/produits', component:ProduitComponent, canActivate: [AdminGuard]},
  {path: 'e-commerce/produits/ajouter', component:ProduitAjouterComponent, canActivate: [AdminGuard]},
  {path: 'e-commerce/produits/modifier/:id', component:ProduitModifierComponent, canActivate: [AdminGuard]},

  //e-commerce categorie
  {path: 'boutique/categorie', component:CategorieComponent},
  {path: 'boutique/ajouter/categorie', component:CategorieAjouterComponent},
  {path: 'boutique/categorie/modifier/:id', component:CategorieModifierComponent},
  //
  {path: 'boutique/commande', component:CommandeComponent, canActivate: [AdminGuard]},
  //
  {path: 'boutique/paiement', component:PaiementComponent},
  //profil
  {path: 'profil', component:ProfilComponent},
  //liste cours
  {path: 'list-cours', component:ListcoursComponent},
  //
  {path: 'list-cours/terminer', component:ListCoursTermineComponent},
  //a-propos
  {path: 'a-propos', component:AProposComponent},
];
