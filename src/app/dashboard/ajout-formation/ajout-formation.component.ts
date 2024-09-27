import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidbarComponent } from '../sidbar/sidbar.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { FormationService } from '../services/formation.service';
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

  constructor(
    private formBuilder: FormBuilder,
    private formationService: FormationService
  ) {
    this.formationForm = this.formBuilder.group({
      nom_formation: ['', Validators.required],
      prix: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Initialization logic if needed
  }

  onSubmit() {
    if (this.formationForm.valid) {
      const formationData: Formation = this.formationForm.value;
      this.formationService.createFormation(formationData).subscribe(
        response => {
          console.log('Formation ajoutée avec succès', response);
          // Réinitialiser le formulaire ou rediriger l'utilisateur
          this.formationForm.reset();
          // Vous pouvez ajouter ici une logique pour afficher un message de succès à l'utilisateur
        },
        error => {
          console.error('Erreur lors de l\'ajout de la formation', error);
          // Vous pouvez ajouter ici une logique pour afficher un message d'erreur à l'utilisateur
        }
      );
    }
  }
}
