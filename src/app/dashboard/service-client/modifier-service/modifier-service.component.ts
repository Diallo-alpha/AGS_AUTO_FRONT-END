import { Component, OnInit } from '@angular/core';
import { SidbarComponent } from '../../sidbar/sidbar.component';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../../../services/service.service';
import { PartenaireService } from '../../../services/partenaire.service';
import { partenaire } from '../../../models/partenaireModel';
import { service } from '../../../models/serviceModel';

@Component({
  selector: 'app-modifier-service',
  standalone: true,
  imports: [SidbarComponent, RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './modifier-service.component.html',
  styleUrls: ['./modifier-service.component.css']
})
export class ModifierServiceComponent implements OnInit {
  serviceForm: FormGroup;
  partenaires: partenaire[] = [];
  selectedFile: File | null = null;
  currentService: service | null = null;

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private partenaireService: PartenaireService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.serviceForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      partenaire_id: ['', Validators.required],
      photo: [null]
    });
  }

  ngOnInit() {
    this.loadPartenaires();
    const serviceId = this.route.snapshot.paramMap.get('id');
    if (serviceId) {
      this.loadService(parseInt(serviceId, 10));
    }
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

  loadService(id: number) {
    this.serviceService.getService(id).subscribe(
      (service) => {
        this.currentService = service;
        this.serviceForm.patchValue({
          titre: service.titre,
          description: service.description,
          partenaire_id: service.partenaire_id
        });
      },
      (error) => {
        console.error('Erreur lors du chargement du service', error);
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
    if (this.serviceForm.valid && this.currentService) {
      const formData = new FormData();
      formData.append('titre', this.serviceForm.get('titre')?.value);
      formData.append('description', this.serviceForm.get('description')?.value);
      formData.append('partenaire_id', this.serviceForm.get('partenaire_id')?.value);
      if (this.selectedFile) {
        formData.append('photo', this.selectedFile, this.selectedFile.name);
      }

      this.serviceService.updateService(this.currentService.id, formData).subscribe(
        (response) => {
          console.log('Service mis à jour avec succès', response);
          this.router.navigate(['/services']); // Rediriger vers la liste des services
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du service', error);
        }
      );
    } else {
      console.error('Formulaire invalide ou service non chargé');
    }
  }
}
