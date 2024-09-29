import { Component } from '@angular/core';
import { SidbarComponent } from '../../sidbar/sidbar.component';
import { FormsModule } from '@angular/forms';
import { PartenaireService } from '../../../services/partenaire.service';
import { partenaire } from '../../../models/partenaireModel';

@Component({
  selector: 'app-ajouter-partenaire',
  standalone: true,
  imports: [SidbarComponent, FormsModule],
  templateUrl: './ajouter-partenaire.component.html',
  styleUrl: './ajouter-partenaire.component.css'
})
export class AjouterPartenaireComponent {
  partenaire: partenaire = {
    id: 0, // Ceci sera ignoré lors de la création
    nom_partenaire: '',
    logo: '',
    email: '',
    telephone: ''
  };
  selectedFile: File | null = null;

  constructor(private partenaireService: PartenaireService) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;
  }

  ajouterPartenaire(): void {
    if (this.selectedFile) {
      // Passer l'objet partenaire et le fichier logo séparément
      this.partenaireService.createPartenaire(this.partenaire, this.selectedFile)
        .subscribe(
          response => {
            console.log('Partenaire ajouté avec succès', response);
            // Réinitialiser le formulaire
            this.partenaire = {
              id: 0,
              nom_partenaire: '',
              logo: '',
              email: '',
              telephone: ''
            };
            this.selectedFile = null;
          },
          error => {
            console.error('Erreur lors de l\'ajout du partenaire', error);
          }
        );
    } else {
      console.error('Veuillez sélectionner un logo');
    }
  }
}
