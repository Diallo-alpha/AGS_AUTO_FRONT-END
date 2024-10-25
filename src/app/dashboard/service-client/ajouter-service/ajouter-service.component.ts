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
  submitted = false;

  // Constantes pour les validations
  private readonly MAX_TITRE_LENGTH = 100;
  private readonly MIN_TITRE_LENGTH = 3;
  private readonly MAX_DESCRIPTION_LENGTH = 1000;
  private readonly MIN_DESCRIPTION_LENGTH = 10;
  private readonly ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private partenaireService: PartenaireService
  ) {
    this.serviceForm = this.fb.group({
      titre: ['', [
        Validators.required,
        Validators.minLength(this.MIN_TITRE_LENGTH),
        Validators.maxLength(this.MAX_TITRE_LENGTH)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(this.MIN_DESCRIPTION_LENGTH),
        Validators.maxLength(this.MAX_DESCRIPTION_LENGTH)
      ]],
      partenaire_id: ['', [Validators.required]],
      photo: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadPartenaires();
  }

  // Getter pour faciliter l'accès aux contrôles du formulaire
  get f() {
    return this.serviceForm.controls;
  }

  loadPartenaires() {
    this.partenaireService.getPartenaires().subscribe({
      next: (data) => {
        this.partenaires = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des partenaires', error);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      // Validation du type de fichier
      if (!this.ALLOWED_FILE_TYPES.includes(file.type)) {
        this.f['photo'].setErrors({ invalidType: true });
        return;
      }

      // Validation de la taille du fichier
      if (file.size > this.MAX_FILE_SIZE) {
        this.f['photo'].setErrors({ invalidSize: true });
        return;
      }

      this.selectedFile = file;
      this.serviceForm.patchValue({ photo: file });
      this.f['photo'].updateValueAndValidity();
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.serviceForm.invalid) {
      Object.keys(this.serviceForm.controls).forEach(key => {
        const control = this.serviceForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    if (!this.selectedFile) {
      this.f['photo'].setErrors({ required: true });
      return;
    }

    const formData = new FormData();
    formData.append('titre', this.f['titre'].value);
    formData.append('description', this.f['description'].value);
    formData.append('partenaire_id', this.f['partenaire_id'].value);
    formData.append('photo', this.selectedFile, this.selectedFile.name);

    this.serviceService.createService(formData).subscribe({
      next: (response) => {
        console.log('Service ajouté avec succès', response);
        this.serviceForm.reset();
        this.submitted = false;
        this.selectedFile = null;
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du service', error);
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.f[fieldName];

    if (!control?.errors) return '';

    if (control.errors['required']) return 'Ce champ est requis';

    switch (fieldName) {
      case 'titre':
        if (control.errors['minlength'])
          return `Le titre doit contenir au moins ${this.MIN_TITRE_LENGTH} caractères`;
        if (control.errors['maxlength'])
          return `Le titre ne peut pas dépasser ${this.MAX_TITRE_LENGTH} caractères`;
        break;

      case 'description':
        if (control.errors['minlength'])
          return `La description doit contenir au moins ${this.MIN_DESCRIPTION_LENGTH} caractères`;
        if (control.errors['maxlength'])
          return `La description ne peut pas dépasser ${this.MAX_DESCRIPTION_LENGTH} caractères`;
        break;

      case 'photo':
        if (control.errors['invalidType'])
          return 'Format de fichier non supporté. Utilisez JPG, JPEG ou PNG';
        if (control.errors['invalidSize'])
          return 'La taille du fichier ne doit pas dépasser 5MB';
        break;
    }

    return 'Champ invalide';
  }
}
