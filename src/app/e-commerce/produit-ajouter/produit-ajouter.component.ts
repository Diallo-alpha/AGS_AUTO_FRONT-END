import { Component, OnInit } from '@angular/core';
import { SidbarComponent } from '../../dashboard/sidbar/sidbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProduitService } from '../../services/produit.service';
import { CategorieService } from '../../services/categorie.service';
import { Categorie } from '../../models/categorieModel';

@Component({
  selector: 'app-produit-ajouter',
  standalone: true,
  imports: [SidbarComponent, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './produit-ajouter.component.html',
  styleUrl: './produit-ajouter.component.css'
})
export class ProduitAjouterComponent implements OnInit {
  produitForm: FormGroup;
  categories: Categorie[] = [];
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private produitService: ProduitService,
    private categorieService: CategorieService
  ) {
    this.produitForm = this.fb.group({
      nom_produit: ['', Validators.required],
      description: [''],
      prix: [0, [Validators.required, Validators.min(0)]],
      quantite: [0, [Validators.required, Validators.min(0)]],
      categorie_id: ['', Validators.required],
      image: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categorieService.getCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Erreur lors du chargement des catégories', error);
      }
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file;
    this.produitForm.patchValue({ image: file });
    this.produitForm.get('image')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.produitForm.valid) {
      const formData = new FormData();
      Object.keys(this.produitForm.value).forEach(key => {
        if (key === 'image' && this.selectedFile) {
          formData.append(key, this.selectedFile, this.selectedFile.name);
        } else {
          formData.append(key, this.produitForm.value[key]);
        }
      });

      this.produitService.createProduit(formData).subscribe(
        (response) => {
          console.log('Produit ajouté avec succès', response);
          this.resetForm();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du produit', error);
        }
      );
    }
  }

  resetForm() {
    this.produitForm.reset({
      nom_produit: '',
      description: '',
      prix: 0,
      quantite: 0,
      categorie_id: '',
      image: null
    });
    this.selectedFile = null;
  }
}
