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

  loadFormation() {
    this.formationService.getFormation(this.formationId).subscribe(
      (formation: Formation) => {
        this.formationForm.patchValue({
          nom_formation: formation.nom_formation,
          prix: formation.prix,
          description: formation.description
        });
      },
      error => {
        console.error('Erreur lors du chargement de la formation', error);
      }
    );
  }

  onSubmit() {
    if (this.formationForm.valid) {
      const updatedFormation: Formation = {
        ...this.formationForm.value,
        id: this.formationId
      };

      this.formationService.updateFormation(this.formationId, updatedFormation).subscribe(
        response => {
          console.log('Formation modifiée avec succès', response);
          this.router.navigate(['/dashboard/formation']); 
        },
        error => {
          console.error('Erreur lors de la modification de la formation', error);
        }
      );
    }
  }
}
