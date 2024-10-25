import { Component, OnInit } from '@angular/core';
import { SidbarComponent } from '../../dashboard/sidbar/sidbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProduitService } from '../../services/produit.service';
import { Produit } from '../../models/produitModel';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-produit',
  standalone: true,
  imports: [SidbarComponent, CommonModule, RouterModule],
  templateUrl: './produit.component.html',
  styleUrl: './produit.component.css'
})
export class ProduitComponent implements OnInit {
  produits: Produit[] = [];
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  selectedImage: SafeResourceUrl | null = null;

  constructor(
    private produitService: ProduitService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadProduits();
  }

  loadProduits(page: number = 1) {
    this.produitService.getProduits(page).subscribe(
      (response) => {
        this.produits = response.data;
        this.currentPage = response.current_page;
        this.totalPages = response.last_page;
        this.totalItems = response.total;
        console.log('Produits chargés:', this.produits);
      },
      (error) => {
        console.error('Erreur lors du chargement des produits', error);
      }
    );
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.loadProduits(page);
    }
  }

  showImage(imageUrl: string | null) {
    console.log('Image URL:', imageUrl);
    if (imageUrl) {
      this.selectedImage = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
    } else {
      this.selectedImage = null;
    }
  }

  closeImage() {
    this.selectedImage = null;
  }

  deleteProduit(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.produitService.deleteProduit(id).subscribe(
        () => {
          this.loadProduits(this.currentPage);
        },
        (error) => {
          console.error('Erreur lors de la suppression du produit', error);
        }
      );
    }
  }

  handleImageError(event: any) {
    console.error('Erreur de chargement de l\'image:', event);
    event.target.src = 'assets/images/default-product-image.png'; 
  }
}
