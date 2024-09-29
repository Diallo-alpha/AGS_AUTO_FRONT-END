import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PartenaireService } from '../../../services/partenaire.service';
import { partenaire } from '../../../models/partenaireModel';
import { SidbarComponent } from '../../sidbar/sidbar.component';

@Component({
  selector: 'app-modifier-partenaire',
  standalone: true,
  imports: [CommonModule, FormsModule, SidbarComponent],
  templateUrl: './modifier-partenaire.component.html',
  styleUrl: './modifier-partenaire.component.css'
})
export class ModifierPartenaireComponent implements OnInit {
  partenaire: partenaire = {
    id: 0,
    nom_partenaire: '',
    logo: '',
    email: '',
    telephone: ''
  };
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private partenaireService: PartenaireService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPartenaire(+id);
    }
  }

  loadPartenaire(id: number): void {
    this.partenaireService.getPartenaire(id).subscribe(
      (data) => {
        this.partenaire = data;
      },
      (error) => {
        console.error('Erreur lors du chargement du partenaire', error);
      }
    );
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  modifierPartenaire(): void {
    if (this.partenaire.id) {
      const logoToSend = this.selectedFile !== null ? this.selectedFile : undefined;

      this.partenaireService.updatePartenaire(this.partenaire.id, this.partenaire, logoToSend).subscribe(
        () => {
          console.log('Partenaire modifié avec succès');
          this.router.navigate(['/dashboard/partenaire']);
        },
        (error) => {
          console.error('Erreur lors de la modification du partenaire', error);
        }
      );
    }
  }

}
