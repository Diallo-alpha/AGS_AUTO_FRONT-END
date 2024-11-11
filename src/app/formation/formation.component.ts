import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { FormationService } from '../services/formation.service';
import { CommonModule } from '@angular/common';
import { NavConnectComponent } from '../nav-connect/nav-connect.component';
import { AuthService } from '../services/authservice.service';
import { ReduirePipe } from '../pipe/reduire';

@Component({
  selector: 'app-formation',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule, RouterModule, NavConnectComponent, ReduirePipe],
  templateUrl: './formation.component.html',
  styleUrl: './formation.component.css'
})
export class FormationComponent implements OnInit {
  formations: any[] = [];
  formationAvis: { [key: number]: any } = {};

  constructor(
    private formationService: FormationService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.formationService.getAllFormations().subscribe((data) => {
      this.formations = data;
      this.formations.forEach(formation => {
        this.getFormationAvis(formation.id);
      });
    });
  }

  getFormationAvis(formationId: number): void {
    this.formationService.getFormationAvis(formationId).subscribe(
      (data) => {
        this.formationAvis[formationId] = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des avis:', error);
      }
    );
  }

  isEtudiant(): boolean {
    return this.authService.isEtudiant();
  }
}
