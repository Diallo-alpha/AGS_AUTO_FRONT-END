import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { FormationService } from '../services/formation.service';
import { CommonModule } from '@angular/common';
import { NavConnectComponent } from '../nav-connect/nav-connect.component';
import { AuthService } from '../services/authservice.service';

@Component({
  selector: 'app-formation',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule, RouterModule, NavConnectComponent],
  templateUrl: './formation.component.html',
  styleUrl: './formation.component.css'
})
export class FormationComponent {
  formations: any[] = [];

  constructor(private formationService: FormationService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.formationService.getAllFormations().subscribe((data) => {
      this.formations = data;
    });
  }

  isEtudiant(): boolean {
    return this.authService.isEtudiant();
  }

}
