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

      // Ajouter chaque champ du formulaire au FormData
      formData.append('nom_formation', this.formationForm.get('nom_formation')?.value);
      formData.append('prix', this.formationForm.get('prix')?.value);
      formData.append('description', this.formationForm.get('description')?.value);

      // Ajouter le fichier image séparément
      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }

      this.formationService.createFormation(formData).subscribe(
        response => {
          console.log('Formation ajoutée avec succès', response);
          this.formationForm.reset();
          this.selectedFile = null;
        },
        error => {
          console.error('Erreur lors de l\'ajout de la formation', error);
        }
      );
    }
  }
}
