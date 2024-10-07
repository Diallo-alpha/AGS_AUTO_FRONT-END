import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidbarComponent } from '../sidbar/sidbar.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormationService } from '../../services/formation.service';
import { Formation } from '../../models/FormationModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ajout-formation',
  standalone: true,
  imports: [RouterModule, SidbarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './ajout-formation.component.html',
  styleUrls: ['./ajout-formation.component.css']
})
export class AjoutFormationComponent implements OnInit {
  formationForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private formationService: FormationService
  ) {
    this.formationForm = this.formBuilder.group({
      nom_formation: ['', Validators.required],
      prix: ['', [Validators.required, Validators.min(0)]],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Initialization logic if needed
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedFile = fileList[0];
    }
  }

  onSubmit() {
    if (this.formationForm.valid) {
      const formData = new FormData();

      // Log des valeurs du formulaire avant de les ajouter au FormData
      console.log('Valeurs du formulaire:', this.formationForm.value);

      formData.append('nom_formation', this.formationForm.get('nom_formation')?.value || '');
      formData.append('description', this.formationForm.get('description')?.value || '');
      formData.append('prix', this.formationForm.get('prix')?.value?.toString() || '');

      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }

      // Afficher le contenu de FormData
      console.log('Contenu du FormData:');
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      this.formationService.createFormation(formData).subscribe(
        response => {
          console.log('Formation ajoutée avec succès', response);
          this.formationForm.reset();
          this.selectedFile = null;
        },
        error => {
          console.error('Erreur lors de l\'ajout de la formation', error);
          if (error.error && error.error.errors) {
            console.log('Erreurs de validation:', error.error.errors);
          }
        }
      );
    } else {
      console.log('Formulaire invalide', this.formationForm.errors);
      // Afficher les erreurs spécifiques à chaque champ
      Object.keys(this.formationForm.controls).forEach(key => {
        const control = this.formationForm.get(key);
        if (control?.errors) {
          console.log(`Erreurs pour ${key}:`, control.errors);
        }
      });
    }
  }
}
