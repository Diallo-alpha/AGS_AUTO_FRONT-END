import { Component, OnInit } from '@angular/core';
import { SidbarComponent } from '../../sidbar/sidbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../../../services/service.service';
import { PartenaireService } from '../../../services/partenaire.service';
import { partenaire } from '../../../models/partenaireModel';

@Component({
  selector: 'app-ajouter-service',
  standalone: true,
  imports: [SidbarComponent, RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './ajouter-service.component.html',
  styleUrls: ['./ajouter-service.component.css']
})
export class AjouterServiceComponent implements OnInit {
  serviceForm: FormGroup;
  partenaires: partenaire[] = [];
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private partenaireService: PartenaireService
  ) {
    this.serviceForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      partenaire_id: ['', Validators.required],
      photo: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.loadPartenaires();
  }

  loadPartenaires() {
    this.partenaireService.getPartenaires().subscribe(
      (data) => {
        this.partenaires = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des partenaires', error);
      }
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.serviceForm.patchValue({ photo: file });
    this.serviceForm.get('photo')?.updateValueAndValidity();
    this.selectedFile = file;
  }

  onSubmit() {
    if (this.serviceForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('titre', this.serviceForm.get('titre')?.value);
      formData.append('description', this.serviceForm.get('description')?.value);
      formData.append('partenaire_id', this.serviceForm.get('partenaire_id')?.value);
      formData.append('photo', this.selectedFile, this.selectedFile.name);

      this.serviceService.createService(formData).subscribe(
        (response) => {
          console.log('Service ajouté avec succès', response);
          // Réinitialiser le formulaire ou rediriger l'utilisateur
          this.serviceForm.reset();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du service', error);
        }
      );
    } else {
      console.error('Formulaire invalide ou aucun fichier sélectionné');
    }
  }
}
