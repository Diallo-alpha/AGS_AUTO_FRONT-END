import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressionService } from '../services/progression.service';
import { forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Router, RouterModule } from '@angular/router';

// Interface pour la réponse API des formations
interface ApiResponse {
  status: string;
  message: string;
  data: FormationAPI[];
}

interface FormationAPI {
  id: number;
  titre: string; // Utiliser le champ "titre" tel qu'il est dans la réponse API
  image: string;
}

// Interface pour la réponse de progression
interface ProgressionResponse {
  status: string;
  message: string;
  data: {
    pourcentage: number;
    completed: boolean;
    videos_regardees: number[];
  };
}

@Component({
  selector: 'app-listcours',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listcours.component.html',
  styleUrls: ['./listcours.component.css']
})
export class ListcoursComponent implements OnInit {
  formationsEnCours: (FormationAPI & { progression: number })[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private progressionService: ProgressionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerFormations();
  }

  private chargerFormations(): void {
    this.progressionService.getFormationsEnCours().pipe(
      map((response: ApiResponse) => {
        console.log('Response from API:', response);

        // Vérifier la structure des données de l'API
        if (!response?.data || response.data.length === 0) {
          return [];
        }

        // Assurez-vous que vous retournez un tableau de FormationAPI avec le bon champ "titre"
        return response.data.map(formation => ({
          id: formation.id,
          titre: formation.titre, // Utiliser "titre" au lieu de "nom_formation"
          image: formation.image
        }));
      }),
      switchMap((formations: FormationAPI[]) => {
        if (formations.length === 0) {
          return of([]); // Retourner un tableau vide si aucune formation
        }

        // Créer les observables pour obtenir la progression
        const progressionObservables = formations.map(formation =>
          this.progressionService.getProgression(formation.id).pipe(
            map((progressionResponse: ProgressionResponse) => ({
              ...formation,
              progression: progressionResponse?.data?.pourcentage || 0
            })),
            catchError(() => of({ ...formation, progression: 0 }))
          )
        );

        return forkJoin(progressionObservables);
      }),
      catchError(error => {
        console.error('Erreur:', error);
        this.error = 'Erreur lors du chargement des cours. Veuillez réessayer.';
        return of([]);
      })
    ).subscribe({
      next: (formationsAvecProgression) => {
        this.formationsEnCours = formationsAvecProgression.filter(
          formation => formation.progression < 100
        );
        this.loading = false;
        console.log('Formations finales:', this.formationsEnCours);
      },
      error: (err) => {
        console.error('Erreur détaillée:', err);
        this.error = 'Erreur lors du chargement des cours.';
        this.loading = false;
      }
    });
  }

  navigateToCours(coursId: number) {
    this.router.navigate(['/cours', coursId]);
  }
}
