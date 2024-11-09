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
  produitForm: FormGroup = this.fb.group({
    nom_produit: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', Validators.required],
    prix: [null, [Validators.required, Validators.min(0.01)]],
    quantite: [null, [Validators.required, Validators.min(0)]],
    categorie_id: ['', Validators.required],
    image: [null, Validators.required]
  });

  categories: Categorie[] = [];
  selectedFile: File | null = null;
  formSubmitted = false;
  uploadMessage = '';

  constructor(
    private fb: FormBuilder,
    private produitService: ProduitService,
    private categorieService: CategorieService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  // Getters pour faciliter l'accès aux contrôles dans le template
  get nom_produit() { return this.produitForm.get('nom_produit'); }
  get description() { return this.produitForm.get('description'); }
  get prix() { return this.produitForm.get('prix'); }
  get quantite() { return this.produitForm.get('quantite'); }
  get categorie_id() { return this.produitForm.get('categorie_id'); }
  get image() { return this.produitForm.get('image'); }

  loadCategories() {
    this.categorieService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories', error);
        this.uploadMessage = 'Erreur lors du chargement des catégories';
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validation du type de fichier (images uniquement)
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        this.uploadMessage = 'Type de fichier non valide. Veuillez sélectionner une image (JPEG, PNG ou GIF)';
        event.target.value = '';
        return;
      }

      // Validation de la taille du fichier (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.uploadMessage = 'Le fichier est trop volumineux. Taille maximale: 5MB';
        event.target.value = '';
        return;
      }

      this.selectedFile = file;
      this.produitForm.patchValue({ image: file });
      this.produitForm.get('image')?.updateValueAndValidity();
      this.uploadMessage = '';
    }
  }

  onSubmit() {
    this.formSubmitted = true;

    if (this.produitForm.valid && this.selectedFile) {
      const formData = new FormData();

      Object.keys(this.produitForm.value).forEach(key => {
        if (key === 'image') {
          formData.append(key, this.selectedFile as File);
        } else {
          formData.append(key, this.produitForm.value[key]);
        }
      });

      this.produitService.createProduit(formData).subscribe({
        next: (response) => {
          this.uploadMessage = 'Produit ajouté avec succès';
          this.resetForm();
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du produit', error);
          this.uploadMessage = 'Erreur lors de l\'ajout du produit';
        }
      });
    }
  }

  resetForm() {
    this.formSubmitted = false;
    this.uploadMessage = '';
    this.selectedFile = null;
    this.produitForm.reset({
      nom_produit: '',
      description: '',
      prix: null,
      quantite: null,
      categorie_id: '',
      image: null
    });
  }
}
