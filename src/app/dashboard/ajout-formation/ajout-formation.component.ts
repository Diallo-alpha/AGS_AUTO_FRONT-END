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
  submitted = false; // Pour suivre si le formulaire a été soumis

  constructor(
    private formBuilder: FormBuilder,
    private formationService: FormationService
  ) {
    this.formationForm = this.formBuilder.group({
      nom_formation: ['', [Validators.required, Validators.minLength(10)]],
      prix: ['', [Validators.required, Validators.min(0)]],
      image: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(100)]]
    });
  }

  ngOnInit() {
  }

  // Getter pour accéder facilement aux contrôles du formulaire
  get f() {
    return this.formationForm.controls;
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedFile = fileList[0];
      // Mettre à jour manuellement la valeur du contrôle image
      this.formationForm.patchValue({
        image: this.selectedFile.name
      });
    }
  }

  // Méthodes pour vérifier les erreurs spécifiques
  getErrorMessage(fieldName: string): string {
    const control = this.formationForm.get(fieldName);

    if (control?.errors) {
      if (control.errors['required']) {
        return `Ce champ est obligatoire`;
      }
      if (control.errors['minlength']) {
        return `Le ${fieldName} doit contenir au moins ${control.errors['minlength'].requiredLength} caractères`;
      }
      if (control.errors['min']) {
        return 'Le prix doit être supérieur ou égal à 0';
      }
    }
    return '';
  }

  onSubmit() {
    this.submitted = true;

    if (this.formationForm.valid) {
      const formData = new FormData();

      formData.append('nom_formation', this.formationForm.get('nom_formation')?.value || '');
      formData.append('description', this.formationForm.get('description')?.value || '');
      formData.append('prix', this.formationForm.get('prix')?.value?.toString() || '');

      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }

      this.formationService.createFormation(formData).subscribe(
        response => {
          console.log('Formation ajoutée avec succès', response);
          this.formationForm.reset();
          this.selectedFile = null;
          this.submitted = false;
        },
        error => {
          console.error('Erreur lors de l\'ajout de la formation', error);
          if (error.error && error.error.errors) {
            console.log('Erreurs de validation:', error.error.errors);
          }
        }
      );
    } else {
      console.log('Formulaire invalide');
      Object.keys(this.formationForm.controls).forEach(key => {
        const control = this.formationForm.get(key);
        if (control?.errors) {
          console.log(`Erreurs pour ${key}:`, control.errors);
        }
      });
    }
  }
}
