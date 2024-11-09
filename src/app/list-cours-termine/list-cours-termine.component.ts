import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Formation } from '../models/FormationModel';
import { ProgressionService } from '../services/progression.service';
import { Router, RouterModule } from '@angular/router';

interface FormationAvecProgression {
  formation: Formation;
  progression: {
    pourcentage: number;
    terminer: boolean;
    date_completion: Date;
  };
}

interface ProgressionResponse {
  status: string;
  message: string;
  data: {
    total: number;
    formations: FormationAvecProgression[];
  };
}
export interface ApiResponse {
  status: string;
  message: string;
  data: any;
}


@Component({
  selector: 'app-list-cours-termine',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-cours-termine.component.html',
  styleUrl: './list-cours-termine.component.css',
})
export class ListCoursTermineComponent implements OnInit {
  formationsTerminees: FormationAvecProgression[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private progressionService: ProgressionService, private router: Router) {}

  ngOnInit(): void {
    this.chargerFormationsTerminees();
  }

  chargerFormationsTerminees(): void {
    this.isLoading = true;
    this.error = null;

    this.progressionService.getFormationsTerminees().subscribe({
      next: (response: ProgressionResponse) => {
        this.formationsTerminees = response.data.formations;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des formations terminées:', err);
        this.error = 'Une erreur est survenue lors du chargement des formations.';
        this.isLoading = false;
      }
    });
  }

  telechargerCertificat(formationId: number): void {
    this.progressionService.generateCertificate(formationId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificat-formation-${formationId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err) => {
        console.error('Erreur lors du téléchargement du certificat:', err);
        alert('Une erreur est survenue lors du téléchargement du certificat.');
      }
    });
  }

  partagerSurLinkedIn(formationAvecProgression: FormationAvecProgression): void {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(`J'ai terminé la formation "${formationAvecProgression.formation.nom_formation}"`);
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`;
    window.open(linkedinUrl, '_blank');
  }
  //cours
  navigateToCours(coursId: number) {
    this.router.navigate(['/cours', coursId]);
  }
}
