import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidbarComponent } from '../sidbar/sidbar.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PhotoFormationService } from '../../services/photo-formation.service';
import { FormationService } from '../../services/formation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ajout-photo',
  standalone: true,
  imports: [RouterModule, SidbarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './ajout-photo.component.html',
  styleUrls: ['./ajout-photo.component.css']
}) 
export class AjoutPhotoComponent implements OnInit {
  photoForm: FormGroup;
  formations: any[] = [];
  selectedFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private photoFormationService: PhotoFormationService,
    private formationService: FormationService
  ) {
    this.photoForm = this.formBuilder.group({
      nom_photo: ['', Validators.required],
      formation_id: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadFormations();
  }

  loadFormations() {
    this.formationService.getAllFormations().subscribe(
      (formations) => {
        this.formations = formations;
      },
      (error) => {
        console.error('Erreur lors du chargement des formations', error);
      }
    );
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  onSubmit() {
    if (this.photoForm.valid && this.selectedFile) {
      const formData = this.photoForm.value;
      this.photoFormationService.createPhotoFormation(formData, this.selectedFile).subscribe(
        (response) => {
          console.log('Photo ajoutée avec succès', response);
          // Réinitialiser le formulaire ou rediriger l'utilisateur
          this.photoForm.reset();
          this.selectedFile = null;
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de la photo', error);
        }
      );
    }
  }
}
