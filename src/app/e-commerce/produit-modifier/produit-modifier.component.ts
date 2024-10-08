import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SidbarComponent } from '../../dashboard/sidbar/sidbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProduitService } from '../../services/produit.service';
import { CategorieService } from '../../services/categorie.service';
import { Produit } from '../../models/produitModel';
import { Categorie } from '../../models/categorieModel';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-produit-modifier',
  standalone: true,
  imports: [SidbarComponent, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './produit-modifier.component.html',
  styleUrl: './produit-modifier.component.css'
})
export class ProduitModifierComponent implements OnInit {
  produitForm: FormGroup;
  categories: Categorie[] = [];
  produit: Produit | null = null;
  selectedFile: File | null = null;
  safeImageUrl: SafeResourceUrl | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private produitService: ProduitService,
    private categorieService: CategorieService,
    private sanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.produitForm = this.fb.group({
      nom_produit: ['', Validators.required],
      description: [''],
      prix: [0, [Validators.required, Validators.min(0)]],
      quantite: [0, [Validators.required, Validators.min(0)]],
      categorie_id: ['', Validators.required],
      image: [],
    });
  }

  ngOnInit() {
    this.loadCategories();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduit(+id);
    }
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

  loadProduit(id: number) {
    this.produitService.getProduit(id).subscribe(
      (produit) => {
        this.produit = produit;
        this.produitForm.patchValue({
          nom_produit: produit.nom_produit,
          description: produit.description,
          prix: produit.prix,
          quantite: produit.quantite,
          categorie_id: produit.categorie_id
        });
        this.updateSafeImageUrl(produit.image);
        console.log('Produit chargé:', this.produit);
      },
      (error) => {
        console.error('Erreur lors du chargement du produit', error);
      }
    );
  }

  updateSafeImageUrl(imageUrl: string | null) {
    console.log('Image URL reçue:', imageUrl);
    if (imageUrl) {
      this.safeImageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
      console.log('SafeResourceUrl créée:', this.safeImageUrl);
    } else {
      console.log('Aucune image disponible pour le produit');
      this.safeImageUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/placeholder-image.jpg');
    }
    this.changeDetectorRef.detectChanges();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file;
    this.produitForm.patchValue({ image: file });
    this.produitForm.get('image')?.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.safeImageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
      this.changeDetectorRef.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.produitForm.valid && this.produit) {
      const formData = new FormData();
      Object.keys(this.produitForm.value).forEach(key => {
        if (key === 'image' && this.selectedFile) {
          formData.append(key, this.selectedFile, this.selectedFile.name);
        } else {
          formData.append(key, this.produitForm.value[key]);
        }
      });

      this.produitService.updateProduit(this.produit.id, formData).subscribe(
        (response) => {
          console.log('Produit mis à jour avec succès', response);
          this.loadProduit(this.produit!.id); // Recharger le produit pour obtenir les données mises à jour
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du produit', error);
        }
      );
    }
  }

  handleImageError(event: any) {
    console.error('Erreur de chargement de l\'image:', event);
    event.target.src = 'assets/placeholder-image.jpg';
  }
}
