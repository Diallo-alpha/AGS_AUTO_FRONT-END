import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidbarComponent } from '../sidbar/sidbar.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PhotoFormationService } from '../../services/photo-formation.service';
import { CommonModule } from '@angular/common';
import { PhotoFormation } from '../../models/PhotoFormation';
import { FormationService } from '../../services/formation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-modifier-photo',
  standalone: true,
  imports: [RouterModule, SidbarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './modifier-photo.component.html',
  styleUrl: './modifier-photo.component.css'
})
export class ModifierPhotoComponent implements OnInit {
  photoForm: FormGroup;
  formations: any[] = [];
  selectedFile: File | undefined;
  photoId: number = 0;

  private fb = inject(FormBuilder);
  private photoFormationService = inject(PhotoFormationService);
  private formationService = inject(FormationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    this.photoForm = this.fb.group({
      nom_photo: ['', Validators.required],
      formation_id: ['', Validators.required],
      photo: [null]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.photoId = +params['id'];
      this.loadData();
    });
  }

  loadData() {
    forkJoin({
      photo: this.photoFormationService.getPhotoFormation(this.photoId),
      formations: this.formationService.getAllFormations()
    }).subscribe({
      next: (data) => {
        this.formations = data.formations;
        this.photoForm.patchValue({
          nom_photo: data.photo.nom_photo,
          formation_id: data.photo.formation_id
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données', error);
      }
    });
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
    } else {
      this.selectedFile = undefined;
    }
  }

  onSubmit() {
    if (this.photoForm.valid) {
      const photoFormation: PhotoFormation = this.photoForm.value;
      this.photoFormationService.updatePhotoFormation(this.photoId, photoFormation, this.selectedFile)
        .subscribe({
          next: (response) => {
            console.log('Photo modifiée avec succès', response);
            this.router.navigate(['/dashboard/photos/formation']);
          },
          error: (error) => {
            console.error('Erreur lors de la modification de la photo', error);
          }
        });
    }
  }
}
