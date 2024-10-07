import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SidbarComponent } from '../sidbar/sidbar.component';
import { FormationService } from '../../services/formation.service';
import { Formation } from '../../models/FormationModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modifier-formation',
  standalone: true,
  imports: [SidbarComponent, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './modifier-formation.component.html',
  styleUrls: ['./modifier-formation.component.css']
})
export class ModifierFormationComponent implements OnInit {
  formationForm: FormGroup;
  formationId: number = 0;
  selectedFile: File | null = null;
  currentImageUrl: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private formationService: FormationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.formationForm = this.formBuilder.group({
      nom_formation: ['', Validators.required],
      prix: [null, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.formationId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadFormation();
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedFile = fileList[0];
    }
  }

  loadFormation() {
    this.formationService.getFormation(this.formationId).subscribe(
      (formation: Formation) => {
        this.formationForm.patchValue({
          nom_formation: formation.nom_formation,
          prix: formation.prix,
          description: formation.description
        });
        this.currentImageUrl = formation.image;
      },
      error => {
        console.error('Erreur lors du chargement de la formation', error);
      }
    );
  }

  onSubmit() {
    if (this.formationForm.valid) {
      const formData = new FormData();

      formData.append('nom_formation', this.formationForm.get('nom_formation')?.value);
      formData.append('prix', this.formationForm.get('prix')?.value);
      formData.append('description', this.formationForm.get('description')?.value);

      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      } else if (this.currentImageUrl) {
        // Si pas de nouvelle image sélectionnée, on envoie l'URL de l'image existante
        formData.append('image', this.currentImageUrl);
      }

      console.log('FormData avant envoi:', formData);
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      this.formationService.updateFormation(this.formationId, formData).subscribe(
        response => {
          console.log('Formation modifiée avec succès', response);
          this.router.navigate(['/dashboard/formation']);
        },
        error => {
          console.error('Erreur lors de la modification de la formation', error);
          if (error.error && error.error.message) {
            console.error('Message d\'erreur du serveur:', error.error.message);
          }
        }
      );
    } else {
      console.log('Formulaire invalide', this.formationForm.errors);
    }
  }
}
