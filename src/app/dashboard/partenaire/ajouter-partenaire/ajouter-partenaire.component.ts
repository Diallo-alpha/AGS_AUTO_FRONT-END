import { Component } from '@angular/core';
import { SidbarComponent } from '../../sidbar/sidbar.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PartenaireService } from '../../../services/partenaire.service';
import { partenaire } from '../../../models/partenaireModel';

@Component({
  selector: 'app-ajouter-partenaire',
  standalone: true,
  imports: [SidbarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './ajouter-partenaire.component.html',
  styleUrl: './ajouter-partenaire.component.css'
})
export class AjouterPartenaireComponent {
  partenaireForm: FormGroup;
  selectedFile: File | null = null;
  submitted = false;

  constructor(
    private partenaireService: PartenaireService,
    private formBuilder: FormBuilder
  ) {
    this.partenaireForm = this.formBuilder.group({
      nom_partenaire: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{8,}$/) // Au moins 8 chiffres
      ]],
      logo: [null, Validators.required]
    });
  }

  get f() {
    return this.partenaireForm.controls;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0] as File;
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      this.partenaireForm.patchValue({
        logo: file
      });
      this.partenaireForm.get('logo')?.updateValueAndValidity();
    } else {
      this.selectedFile = null;
      this.partenaireForm.get('logo')?.setErrors({ invalidType: true });
    }
  }

  ajouterPartenaire(): void {
    this.submitted = true;

    if (this.partenaireForm.invalid || !this.selectedFile) {
      return;
    }

    const partenaireData: partenaire = {
      id: 0,
      nom_partenaire: this.partenaireForm.get('nom_partenaire')?.value,
      email: this.partenaireForm.get('email')?.value,
      telephone: this.partenaireForm.get('telephone')?.value,
      logo: ''
    };

    this.partenaireService.createPartenaire(partenaireData, this.selectedFile)
      .subscribe(
        response => {
          console.log('Partenaire ajouté avec succès', response);
          this.partenaireForm.reset();
          this.submitted = false;
          this.selectedFile = null;
        },
        error => {
          console.error('Erreur lors de l\'ajout du partenaire', error);
        }
      );
  }
}
