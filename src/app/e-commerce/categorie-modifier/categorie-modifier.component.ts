import { Component, OnInit } from '@angular/core';
import { SidbarComponent } from '../../dashboard/sidbar/sidbar.component';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategorieService } from '../../services/categorie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categorie-modifier',
  standalone: true,
  imports: [SidbarComponent, RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './categorie-modifier.component.html',
  styleUrl: './categorie-modifier.component.css'
})
export class CategorieModifierComponent implements OnInit {
  categorieForm: FormGroup;
  categorieId: number;

  constructor(
    private fb: FormBuilder,
    private categorieService: CategorieService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.categorieForm = this.fb.group({
      nom_categorie: ['', Validators.required]
    });
    this.categorieId = 0;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.categorieId = +params['id'];
      this.loadCategorie(this.categorieId);
    });
  }

  loadCategorie(id: number) {
    this.categorieService.getCategorie(id).subscribe(
      (categorie) => {
        this.categorieForm.patchValue({
          nom_categorie: categorie.nom_categorie
        });
      },
      (error) => {
        console.error('Erreur lors du chargement de la catégorie', error);
      }
    );
  }

  onSubmit() {
    if (this.categorieForm.valid) {
      this.categorieService.updateCategorie(this.categorieId, this.categorieForm.value).subscribe(
        (response) => {
          console.log('Catégorie mise à jour avec succès', response);
          this.router.navigate(['/boutique/categories']);
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de la catégorie', error);
        }
      );
    }
  }
}
