import { Component, OnInit } from '@angular/core';
import { SidbarComponent } from '../../dashboard/sidbar/sidbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategorieService } from '../../services/categorie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categorie-ajouter',
  standalone: true,
  imports: [SidbarComponent, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './categorie-ajouter.component.html',
  styleUrl: './categorie-ajouter.component.css'
})
export class CategorieAjouterComponent implements OnInit {
  categorieForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categorieService: CategorieService,
    private router: Router
  ) {
    this.categorieForm = this.fb.group({
      nom_categorie: ['', Validators.required]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.categorieForm.valid) {
      this.categorieService.createCategorie(this.categorieForm.value).subscribe(
        (response) => {
          console.log('Catégorie ajoutée avec succès', response);
          this.router.navigate(['/boutique/categorie']);
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de la catégorie', error);
        }
      );
    }
  }
}
